import React, { useState, useEffect } from "react";
import shuffle from "lodash.shuffle";
import "./App.css";

// image for the pokemon
// https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}.png

export const pokemons = [
  { id: "004", name: "charizard" },
  { id: "010", name: "caterpie" },
  { id: "077", name: "ponyta" },
  { id: "108", name: "lickitung" },
  { id: "132", name: "ditto" },
  { id: "133", name: "eevee" },
];
const doublePokemon = shuffle([...pokemons, ...pokemons]); // shuffle means randomize the array
console.log(doublePokemon);

export default function App() {
  const [opened, setOpened] = useState([]); // using index | this state only have 2 items max with the selection from user
  const [moves, setMoves] = useState(0); 
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false); 
  const [gameOver, setGameOver] = useState(false); 

  function flipCard(index) {
    // if same card was clicked do nothing
    if (opened.includes(index) || disabled || gameOver) return;

    setOpened((opened) => [...opened, index]);
    setMoves((moves) => moves + 1);
  }

  useEffect(() => {
    if (opened.length === 2) {
      setDisabled(true);

      const firstIndex = opened[0];
      const secondIndex = opened[1];
      const firstPokemon = doublePokemon[firstIndex];
      const secondPokemon = doublePokemon[secondIndex];

      if (firstPokemon.id === secondPokemon.id) {
        setTimeout(() => {
          setMatched((matched) => [...matched, firstIndex, secondIndex]);
          setOpened([]);
          setDisabled(false);
        }, 1000); 
      } else {
        setTimeout(() => {
          setOpened([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [opened]);

  console.log(moves);
  
  useEffect(() => {
    if (matched.length === doublePokemon.length) {
      alert("You won!");
      setGameOver(true);
    }
  }, [matched]);

  return (
    <div className="app">
      <p data-testid="moves-count">
        {moves} <strong>moves</strong>
      </p>

      <div className="cards">
        {doublePokemon.map((pokemon, index) => {
          let isFlipped = false;

          if (opened.includes(index) || matched.includes(index)) isFlipped = true;

          return (
            <PokemonCard
              key={index}
              index={index}
              pokemon={pokemon}
              isFlipped={isFlipped}
              flipCard={flipCard}
            />
          );
        })}
      </div>
    </div>
  );
}

export function PokemonCard({ index, pokemon, isFlipped, flipCard }) {
  return (
    <button
      className={`pokemon-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => flipCard(index)}
      aria-label={`pokemon-card-${pokemon.name}`}
    >
      <div className="inner">
        <div className="front">
          <img
            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}.png`}
            alt={pokemon.name}
            width="100"
          />
        </div>
        <div className="back">?</div>
      </div>
    </button>
  );
}
