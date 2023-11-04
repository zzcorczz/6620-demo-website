import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App, { PokemonCard, pokemons } from "./App"; // Assuming App component and PokemonCard are in the App.js file

describe("App Component", () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Mocking timers
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Restoring real timers after the test
  });

  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/moves/i)).toBeInTheDocument();
  });

  test("displays the correct number of pokemon cards", () => {
    render(<App />);
    const pokemonCards = screen.getAllByRole("button", {
      name: /pokemon-card/i,
    });
    expect(pokemonCards.length).toBe(12);
  });

  test("increments move count when a card is clicked", () => {
    render(<App />);
    const card = screen.getAllByRole("button", {
      name: "pokemon-card-charizard",
    })[0];
    fireEvent.click(card);
    const movesElement = screen.getByTestId("moves-count");
    expect(movesElement.textContent).toBe("1 moves");
  });

  test("increments correctly with each unique card click", () => {
    render(<App />);

    const movesElement = screen.getByTestId("moves-count");
    expect(movesElement.textContent).toBe("0 moves");

    const cards = screen.getAllByRole("button", {
      name: /^pokemon-card/i,
    });

    fireEvent.click(cards[0]);
    expect(movesElement.textContent).toBe("1 moves");

    fireEvent.click(cards[1]);
    expect(movesElement.textContent).toBe("2 moves");

  });

  test("cards match when two of the same pokemon are selected", () => {
    render(<App />);
    const firstCharizardCard = screen.getAllByRole("button", {
      name: "pokemon-card-charizard",
    })[0];
    fireEvent.click(firstCharizardCard);

    const secondCharizardCard = screen.getAllByRole("button", {
      name: "pokemon-card-charizard",
    })[1];
    fireEvent.click(secondCharizardCard);

    expect(firstCharizardCard).toHaveClass("flipped");
    expect(secondCharizardCard).toHaveClass("flipped");
  });

  test("flips back two cards when they don't match", () => {
    render(<App />);

    const cards = screen.getAllByRole("button", {
      name: /^pokemon-card/i,
    });

    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);

    expect(cards[0]).toHaveClass("flipped");
    expect(cards[1]).toHaveClass("flipped");

    act(() => {
      jest.runAllTimers();
    });

    expect(cards[0]).not.toHaveClass("flipped");
    expect(cards[1]).not.toHaveClass("flipped");
  });

  test.skip("finishes the game once all pokemons have been found", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<App />);

    for (const p of pokemons) {
      const cards = screen.getAllByRole("button", {
        name: `pokemon-card-${p.name}`,
      });
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);
    }

    expect(window.alert).toHaveBeenCalledWith("you won!");
  });
});

describe("PokemonCard Component", () => {
  test("renders card with correct image", () => {
    const samplePokemon = { id: "004", name: "charizard" };
    render(
      <PokemonCard
        index={0}
        pokemon={samplePokemon}
        isFlipped={false}
        flipCard={() => {}}
      />
    );
    const img = screen.getByRole("img", { name: /charizard/i });
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(
      "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png"
    );
  });

  test("triggers flipCard when clicked", () => {
    const mockFlipCard = jest.fn();
    const samplePokemon = { id: "004", name: "charizard" };
    render(
      <PokemonCard
        index={0}
        pokemon={samplePokemon}
        isFlipped={false}
        flipCard={mockFlipCard}
      />
    );
    const card = screen.getByRole("button", { name: /pokemon-card/i });
    fireEvent.click(card);
    expect(mockFlipCard).toHaveBeenCalledWith(0);
  });
});
