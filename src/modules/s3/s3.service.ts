import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials, S3 } from 'aws-sdk';
import * as moment from 'moment';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';
import * as mime from 'mime-types';


@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) { }

  async uploadS3(folder: string, buffer, filename) {
    const key = `${folder ? folder + '/' : ''}${moment().valueOf()}_${filename}`;
    try {
      const result = await this.getS3()
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: key,
          Body: buffer,
          ContentType: mime.lookup(filename) as any,
          ACL: 'public-read',
        })
        .promise();

      return result;
    } catch (e) {
      throw new httpBadRequest(e);
    }
  }

  async deleteS3(key: string) {
    if (!key) {
      throw new httpBadRequest("key is required");
    }

    try {
      await this.getS3()
        .deleteObject({
          Key: key,
          Bucket: this.configService.get('AWS_S3_BUCKET'),
        })
        .promise();

      return true;
    } catch (e) {
      throw new httpBadRequest(e);
    }
  }

  private getS3(): S3 {
    const accessKeyId = this.configService.get<string>('AWS_S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('AWS_S3_SECRET_KEY');
    const region = this.configService.get<string>('AWS_REGION');
    const credentials = new Credentials({ accessKeyId, secretAccessKey });
    return new S3({ credentials, region });
  }
}
