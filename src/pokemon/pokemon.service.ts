import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  //Model no es inyectable, no es propiamente un Provider
  //Entonces tengo que inyectarlo de una manera basada en Nestjs con el decorator @InjectModel
  constructor(
    @InjectModel(Pokemon.name)//en los () va el nombre del modelo, esta en pokemon.module el Pokemon.name
    private readonly pokemonModel: Model<Pokemon>
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name=createPokemonDto.name.toLocaleLowerCase();
    try {
      //INSERT
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    
    //Verificar por no
    if(!isNaN(+term)){
      /* Uso findOne porque voy a buscar por la propiedad no y no por ID */
      pokemon=await this.pokemonModel.findOne({no: term});
    }

    //Verificar por mongoId
    if(!pokemon && isValidObjectId(term)){
      pokemon=await this.pokemonModel.findById(term);
    }

    //Verificar por name
    if(!pokemon){
      pokemon=await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)
    }

    return pokemon;
  }

  /* term: puede ser mongoId, name o no */
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    try {
      const pokemon = await this.findOne(term);
    
    if(updatePokemonDto.name){
      updatePokemonDto.name=updatePokemonDto.name.toLocaleLowerCase();
    }
    // { new: true }= usamos si queremos regresar el nuevo OBJ actualizado; sin embargo, vienen otros campos como 
    // 'acknowledged, modifiedcount, upsertedid, upsertedcount, matchedcount. 
    // updatedPokemon tiene la serializacion de ese pokemon al ejecutar updateOne
    // const updatedPokemon = await pokemon.updateOne(updatePokemonDto, { new: true });


    await pokemon.updateOne(updatePokemonDto);
    
    /* ALTERNATIVA  para que no se muestren propiedades que no son 
    y se se muestren al actualizar los campos: _id, name, no y __v*/
    return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // ELIMINAR FISICA: ESTE DELETE BORRA POR ELPARAMETRO QUE LE PASES, SI PASAS MONGOID O NOMBRE, O NRO DE POKEMON
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    //ELIMINAR POR ID PERO TIRA STATUS 200 ASI YA ESTE ELIMANDO EL ID SELECTED
    // const result =await this.pokemonModel.findByIdAndDelete(id);

    //const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    const result = await this.pokemonModel.deleteOne({id: id});
    if(result.deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
    return;
  }


  private handleExceptions(error: any){
    if(error.code===11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create a pokemon - Check server logs`)  
  }
}
