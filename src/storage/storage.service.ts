import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME')!;

    
    this.s3Client = new S3Client({
      endpoint: `http://${this.configService.get('MINIO_ENDPOINT' )!}:${this.configService.get('MINIO_PORT')}`,
      region: 'us-east-1', 
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `http://${this.configService.get('MINIO_ENDPOINT' )}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error('Erro ao fazer upload para MinIO:', error);
      throw new InternalServerErrorException('Falha ao fazer upload do arquivo.');
    }
  }
}
