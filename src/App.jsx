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
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [UIGlobal, setUIGlobal] = useState(false);
  const [contadorErradoGlobal, setContadorErradoGlobal] = useState(() => {
    const savedCount = localStorage.getItem("contadorErradoGlobal");
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const imgPokeRef = useRef(null);
  const buttonHiddenRef = useRef(null);
  const buttonAdivinar = useRef(null);
  const options = useRef(null);
  const { name } = pokemon;

  const obtenerPokemonAleatorio = useCallback(async () => {
    try {
      const pokemonAleatorio = await api.random();
      setPokemon(pokemonAleatorio);
      console.log(pokemonAleatorio.name);
    } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
    }
  }, []);

  useEffect(() => {
    if (juegoTerminado) {
      modalRef.current.showModal();
    }
  }, [juegoTerminado]);

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
      setContadorAcierto((prev) => prev + 1);
      setEstadoJuego(false);
      setAcierto(true);
    } else {
      setContadorErrado((prev) => prev + 1);
      setContadorErradoGlobal((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("contadorErradoGlobal", newCount.toString());
        return newCount;
      });
      setAcierto(false);
      buttonHiddenRef.current.hidden = false;
    }
    if (inputRef.current) {
      inputRef.current.className = `nes-input ${inputNamePokemon === name ? "is-success" : "is-error"}`;
    }

    setJuegoTerminado(
      (prevJuegoTerminado) => prevJuegoTerminado || contadorAcierto + 1 === 10 || contadorErrado + 1 === 10
    );
  }, [inputNamePokemon, name, contadorAcierto, contadorErrado]);

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
      buttonHiddenRef.current.hidden = true;
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
        <div ref={buttonAdivinar} className="button">
          <button
            type="button"
            className={estadoJuego ? "nes-btn is-primary" : "nes-btn is-success"}
            onClick={() => {
              estadoJuego ? verificarRespuesta() : cambiarPokemon();
            }}
          >
            {estadoJuego ? "Adivinar" : "Continuar"}
          </button>
          <button
            ref={buttonHiddenRef}
            type="button"
            className="nes-btn is-warning"
            hidden
            onClick={() => {
              obtenerPokemonAleatorio();
              inputRef.current.value = "";
              inputRef.current.className = "nes-input";
              buttonHiddenRef.current.hidden = true;
            }}
          >
            Skipear
          </button>
          <dialog className="nes-dialog" id="dialog-default" ref={modalRef}>
            <form method="dialog">
              <p>
                {contadorAcierto >= 10 && "¡Has ganado!"}
                {contadorErrado >= 10 && "¡Has perdido!"}
              </p>
              <menu className="dialog-menu">
                <button
                  className="nes-btn"
                  onClick={() => {
                    setJuegoTerminado(false);
                    setContadorAcierto(0);
                    setContadorErrado(0);
                    obtenerPokemonAleatorio();
                  }}
                >
                  {contadorAcierto >= 10 && "Volver a jugar"}
                  {contadorErrado >= 10 && "Volver a intentarlo"}
                </button>
              </menu>
            </form>
          </dialog>
        </div>
      </section>
      <div className="contador-errores">
        <div className="nes-container is-centered">
          <h2 className="aciertos">Aciertos: {contadorAcierto}</h2>
          <progress className="nes-progress is-success" value={contadorAcierto} max="10"></progress>
          <h2 className="fallos">Fallos: {contadorErrado}</h2>
          <progress className="nes-progress is-error" value={contadorErrado} max="10"></progress>
        </div>
        <div className="caja-errores">
          <label>
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={UIGlobal}
              onChange={(e) => {
                setUIGlobal(e.target.checked);
              }}
            />
            <span>Contador global de errores</span>
          </label>
          {UIGlobal && (
            <section ref={options}>
              <p type="button" className="nes-btn is-error">
                {contadorErradoGlobal} errores
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
