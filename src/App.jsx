import { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";
import api from "../api";

function App() {
  const [pokemon, setPokemon] = useState("");
  const [inputNamePokemon, setInputNamePokemon] = useState("");
  const [contadorErrado, setContadorErrado] = useState(0);
  const [contadorAcierto, setContadorAcierto] = useState(0);
  const [acierto, setAcierto] = useState(false);
  const [estadoJuego, setEstadoJuego] = useState(true);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const imgPokeRef = useRef(null);
  const buttonAdivinar = useRef(null);
  const { name } = pokemon;

  const obtenerPokemonAleatorio = useCallback(async () => {
    try {
      const pokemonAleatorio = await api.random();
      setPokemon(pokemonAleatorio);
    } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
    }
  }, []);

  useEffect(() => {
    obtenerPokemonAleatorio();
  }, [obtenerPokemonAleatorio]);

  useEffect(() => {
    if (imgPokeRef.current) {
      imgPokeRef.current.className = estadoJuego ? "img-pokemon-silueta" : "img-pokemon";
    }
  }, [estadoJuego]);

  const verificarRespuesta = useCallback(() => {
    if (inputNamePokemon === name) {
      setEstadoJuego(false);
      setAcierto(true);
      setContadorAcierto((prev) => prev + 1);
    } else {
      setAcierto(false);
      setContadorErrado((prev) => prev + 1);
    }
    if (inputRef.current) {
      inputRef.current.className = `nes-input ${inputNamePokemon === name ? "is-success" : "is-error"}`;
    }
  }, [inputNamePokemon, name]);

  const apretarTecla = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        estadoJuego ? verificarRespuesta() : cambiarPokemon();
      }
    },
    [estadoJuego, verificarRespuesta]
  );

  const cambiarPokemon = useCallback(() => {
    if (acierto) {
      setEstadoJuego(true);
      obtenerPokemonAleatorio();
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.className = "nes-input";
      }
      setInputNamePokemon("");
    }
  }, [acierto, obtenerPokemonAleatorio]);

  return (
    <>
      <div>
        <h1 className="nes-text is-primary">¿Quién es este Pokémon?</h1>
      </div>
      <section className="caja-pokemon">
        <div className="contenedor-pokemon">
          <img ref={imgPokeRef} className="img-pokemon-silueta" src={pokemon.image} alt="" />
        </div>
      </section>
      <section className="caja-input">
        <div className="nes-field" id="field">
          <label htmlFor="name_field"></label>
          <input
            type="text"
            id="name_field"
            ref={inputRef}
            className="nes-input"
            placeholder="Ingresa el nombre del Pókemon"
            onKeyDown={apretarTecla}
            onChange={(data) => {
              setInputNamePokemon(data.target.value.toLocaleLowerCase().replace(/\s+/g, ""));
              inputRef.current.className = "nes-input";
            }}
          />
        </div>
        <div ref={buttonAdivinar}>
          <button
            type="button"
            className={estadoJuego ? "nes-btn is-primary" : "nes-btn is-success"}
            onClick={() => {
              estadoJuego ? verificarRespuesta() : cambiarPokemon();
            }}
          >
            {estadoJuego ? "Adivinar" : "Continuar"}
          </button>
          <dialog className="nes-dialog" id="dialog-default" ref={modalRef}>
            <form method="dialog">
              <p></p>
              <menu className="dialog-menu">
                <button className="nes-btn" onClick={cambiarPokemon}></button>
              </menu>
            </form>
          </dialog>
        </div>
      </section>
      <div className="nes-container is-centered">
        <h2 className="aciertos">Aciertos: {contadorAcierto}</h2>
        <progress className="nes-progress is-success" value={contadorAcierto} max="10"></progress>
        <h2 className="fallos">Fallos: {contadorErrado}</h2>
        <progress className="nes-progress is-error" value={contadorErrado} max="10"></progress>
      </div>
    </>
  );
}

export default App;
