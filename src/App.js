import React, { useState, useEffect } from "react";
import shuffle from "lodash.shuffle";
import "./App.css";

// image for the pokemon
// https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}.png

// Define an array of pokemons, each pokemon has an id and a name
export const pokemons = [
  { id: "004", name: "charizard" },
  { id: "010", name: "caterpie" },
  { id: "077", name: "ponyta" },
  { id: "108", name: "lickitung" },
  { id: "132", name: "ditto" },
  { id: "133", name: "eevee" },
];

// Create a new array that contains two copies of the pokemon array, and shuffle it
const doublePokemon = shuffle([...pokemons, ...pokemons]); // shuffle means randomize the array
// console.log(doublePokemon);

// Define the App component
export default function App() {
  // Define some state variables
  const [opened, setOpened] = useState([]); // using index | this state only have 2 items max with the selection from user 
  const [moves, setMoves] = useState(0); // Store how many moves the user has made
  const [matched, setMatched] = useState([]); // Store the matched cards
  const [disabled, setDisabled] = useState(false); // Whether to disable user interaction
  const [gameOver, setGameOver] = useState(false); // Whether the game is over

  // Define a function to handle the event when the user clicks a card
  function flipCard(index) {
    // if same card was clicked do nothing | if disabled do nothing | if game over do nothing
    if (opened.includes(index) || disabled || gameOver) return;

    // Otherwise, add this card to the array of opened cards and increase the move count
    setOpened((opened) => [...opened, index]);
    setMoves((moves) => moves + 1);
  }

  // Use the useEffect Hook, execute when the array of opened cards changes
  useEffect(() => {
    // If the number of opened cards reaches 2, then check if these two cards match
    if (opened.length === 2) {
      setDisabled(true); // First, disable user interaction

      const firstIndex = opened[0]; // Get the index of the first card
      const secondIndex = opened[1]; // Get the index of the second card
      const firstPokemon = doublePokemon[firstIndex]; // Get the pokemon of the first card
      const secondPokemon = doublePokemon[secondIndex]; // Get the pokemon of the second card

      // If the pokemons of the two cards are the same, then add these two cards to the array of matched cards and clear the array of opened cards
      if (firstPokemon.id === secondPokemon.id) {
        setTimeout(() => {
          setMatched((matched) => [...matched, firstIndex, secondIndex]);
          setOpened([]);
          setDisabled(false);
        }, 1000); 
      } else { 
        // Otherwise, close these two cards after one second and clear the array of opened cards
        setTimeout(() => {
          setOpened([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [opened]);
  
  // Use the useEffect Hook, execute when the array of matched cards changes
  useEffect(() => {
    // If all cards have been matched, then the game is over
    if (matched.length === doublePokemon.length) {
      alert("You won!");
      setGameOver(true);
    }
  }, [matched]);

  // Render the App component
  return (
    <div className="app">
      <p data-testid="moves-count">
        {moves} <strong>moves</strong>
      </p>

      <div className="cards">
        {doublePokemon.map((pokemon, index) => {
          let isFlipped = false;

          // If the card has been opened or matched, then flip it
          if (opened.includes(index) || matched.includes(index)) isFlipped = true;

          // Render each card
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

// Define the PokemonCard component, used to render a card
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
