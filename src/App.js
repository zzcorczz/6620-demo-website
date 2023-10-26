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
const doublePokemon = shuffle([...pokemons, ...pokemons]);

export default function App() {
  const [opened, setOpened] = useState([]); // using index | this state only have 2 items max with the selection from user

  function flipCard(index) {
    // if same card was clicked do nothing
    if (opened.includes(index)) return;

    setOpened((opened) => [...opened, index]);
  }

  return (
    <div className="app">
      <p data-testid="moves-count">
        0 <strong>moves</strong>
      </p>

      <div className="cards">
        {doublePokemon.map((pokemon, index) => {
          let isFlipped = false;

          if (opened.includes(index)) isFlipped = true;

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
