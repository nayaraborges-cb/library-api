import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Res } from '@nestjs/common';
import express from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly storageService: StorageService,
  ) {}

 @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.booksService.findAll(page, limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(Number(id))
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(+id);
  }

  @Post(':id/cover')
@UseInterceptors(FileInterceptor('file'))
async uploadCover(
  @Param('id') id: number,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('Nenhum arquivo de capa fornecido.');
  }
  const fileKey = `covers/${Date.now()}-${file.originalname}`;

  await this.storageService.uploadFile(file, 'covers', fileKey);

  const book = await this.booksService.updateCoverKey(id, fileKey);

  return {
    message: 'Capa atualizada com sucesso!',
    coverKey: book.coverKey,
  };
}

@Get(':id/pdf')
  async generatePdf(
    @Param('id') id: number,
    @Res() res: express.Response,
  ) {
    const book = this.booksService.findOne(Number(id));
    
    if (!book) {
      throw new BadRequestException('Livro não encontrado.');
    }

    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${(await book).title}.pdf"`);
      
      doc.pipe(res);
      
      // Título
      doc.fontSize(24).font('Helvetica-Bold').text((await book).title, { align: 'center' });
      doc.fontSize(14).font('Helvetica').text(`por ${(await book).author}`, { align: 'center' });
      doc.moveDown();
      
      // Linha separadora
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      
      // Informações
      doc.fontSize(12).font('Helvetica-Bold').text('Gênero:');
      doc.fontSize(11).font('Helvetica').text((await book).genre);
      doc.moveDown();
      
      doc.fontSize(12).font('Helvetica-Bold').text('Ano de Publicação:');
      doc.fontSize(11).font('Helvetica').text(String((await book).publication));
      doc.moveDown();
      
      // Descrição
      doc.fontSize(12).font('Helvetica-Bold').text('Descrição:');
      doc.fontSize(11).font('Helvetica').text((await book).resume, { align: 'justify' });
      doc.moveDown();
      
      // Rodapé
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
      
      doc.end();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new BadRequestException('Erro ao gerar PDF do livro.');
    }
  }

}
