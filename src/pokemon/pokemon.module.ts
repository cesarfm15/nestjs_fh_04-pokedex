import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, // Pokemon.name= el name que esta ahi es de la extension de Document en la ENTITY
        schema: PokemonSchema 
      }
    ])
  ],
})
export class PokemonModule {}
