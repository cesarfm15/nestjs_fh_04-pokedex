import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // IMPORTAMOS este PIPE desde el controller
  
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({value, metadata}); // en value viene el valor de para metro que viene por el PATH
    //VALIDO QUE SEA UN MONGOID
    if(!isValidObjectId(value)){
      throw new BadRequestException(`${value} is not a valid MongoId`)
    }    
    return value;
  }
}
