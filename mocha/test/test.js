const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const Pokemon = require('../Pokemons.js').Pokemon;
const PokemonList = require('../Pokemons.js').Pokemonlist;

const name = 'Bulbasaur';
const level = 1;

describe('Класс Pokemon', () => {
  let pokemon = new Pokemon(name, level);
  describe('Метод show', () => {
    it('Вернет строку с заданными значениями', () => {
      let loggerSpy = sinon.spy(console, 'log');
      pokemon.show();
      assert(loggerSpy.calledWith(`Hi! My name is ${name}, my level is ${level}`), 'Не соответствует заданным значениям');
      loggerSpy.restore();
    });
  });

  describe('Метод valueOf', () => {
    it('Вернет значение level', () => {
      assert.equal(level, pokemon.valueOf());
    });
  });
});

describe('Класс PokemonList', () => {
  let count = 10;
  let list = new PokemonList();

  before(() => {
    for(let i = 1; i <= count; i++) {
      list.add(name + i, i);
    }
  });
  after(() => {
    list = new PokemonList();
  });

  describe('Метод Add', () => {
    const list = new PokemonList();
    list.add(name, level);
    it('Создаст объект класса Pokemon и добавит его в массив list', () => {
      assert.instanceOf(list[0], Pokemon);
    });
  });
  describe('Метод Show', () => {

    it('Вернет строку с количеством элементов массива list', () => {
      let loggerSpy = sinon.spy(console, 'log');
      list.show();
      assert(loggerSpy.calledWith(`There are ${count} pokemons here.`));
      loggerSpy.restore();
    });
  });
  describe('Метод max', () => {
    it('Вернет элемент массива list с максимальным значением level', () => {
      assert.equal(count, list.max());
    });
  });
});
