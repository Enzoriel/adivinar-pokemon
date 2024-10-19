import { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";
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
  const { name } = pokemon;

  async function obtenerPokemonAleatorio() {
    try {
      const pokemonAleatorio = await api.random();
      setPokemon(pokemonAleatorio);
      console.log(pokemonAleatorio.name);
    } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
    }
  }

  useEffect(() => {
    estadoJuego
      ? (imgPokeRef.current.className = "img-pokemon-silueta")
      : (imgPokeRef.current.className = "img-pokemon");
  }, [estadoJuego]);

  useEffect(() => {
    obtenerPokemonAleatorio();
  }, []);

  const verificarRespuesta = () => {
    const element = modalRef.current;
    if (inputNamePokemon === name) {
      inputRef.current.className = "nes-input is-success";
      element.querySelector("p").textContent = "Correcto";
      element.querySelector("button").textContent = "Seguir jugando";
      element.querySelector("button").className = "nes-btn is-success";
      setEstadoJuego(false);
      setAcierto(true);
      setContadorAcierto(contadorAcierto + 1);
    } else {
      inputRef.current.className = "nes-input is-error";
      element.querySelector("p").textContent = "Incorrecto";
      element.querySelector("button").textContent = "Volver a intentar";
      element.querySelector("button").className = "nes-btn is-error";
      setAcierto(false);
      setContadorErrado(contadorErrado + 1);
    }
    element.showModal();
  };

  const apretarTecla = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      verificarRespuesta();
    }
  };

  const cambiarPokemon = () => {
    if (acierto) {
      setEstadoJuego(true);
      obtenerPokemonAleatorio();
      inputRef.current.value = "";
      inputRef.current.className = "nes-input";
      setInputNamePokemon("");
    }
  };

  return (
    <>
      <div>
        <h1 className="nes-text is-primary">¿Quién es este Pokémon?</h1>
      </div>
      <section className="caja">
        <div className="contenedor-pokemon">
          <img ref={imgPokeRef} className="img-pokemon-silueta" src={pokemon.image} alt="" />
        </div>
      </section>
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
      <section>
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => {
            verificarRespuesta();
          }}
        >
          Adivinar
        </button>
        <dialog className="nes-dialog" id="dialog-default" ref={modalRef}>
          <form method="dialog">
            <p></p>
            <menu className="dialog-menu">
              <button className="nes-btn" onClick={cambiarPokemon} onKeyDown={cambiarPokemon}></button>
            </menu>
          </form>
        </dialog>
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
