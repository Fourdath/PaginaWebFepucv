import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Mensaje {
  rol: 'usuario' | 'asistente';
  texto: string;
}

interface HistorialItem {
  pregunta: string;
  respuesta: string;
}

const ASISTENTE_DESHABILITADO = true;
const MENSAJE_ASISTENTE_DESHABILITADO =
  'Hola! El asistente virtual FEPUCV se encuentra temporalmente deshabilitado porque esta en fase de entrenamiento.\n\nEstamos trabajando para que vuelva con respuestas mas eficientes y capaces. Gracias por tu paciencia.';

const AsistenteChat: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'asistente',
      texto: MENSAJE_ASISTENTE_DESHABILITADO
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  useEffect(() => {
    if (abierto && !ASISTENTE_DESHABILITADO) setTimeout(() => inputRef.current?.focus(), 100);
  }, [abierto]);

  const buildHistorial = (): HistorialItem[] => {
    const hist: HistorialItem[] = [];
    const msgs = mensajes.slice(1);
    for (let i = 0; i < msgs.length - 1; i++) {
      if (msgs[i].rol === 'usuario' && msgs[i + 1]?.rol === 'asistente') {
        hist.push({ pregunta: msgs[i].texto, respuesta: msgs[i + 1].texto });
        i++;
      }
    }
    return hist;
  };

  const enviar = async (textOverride?: string) => {
    if (ASISTENTE_DESHABILITADO) return;

    const pregunta = (textOverride ?? input).trim();
    if (!pregunta || cargando) return;

    setInput('');
    setMensajes(prev => [...prev, { rol: 'usuario', texto: pregunta }]);
    setCargando(true);

    try {
      const res = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, historial: buildHistorial() })
      });

      const data = await res.json();
      setMensajes(prev => [
        ...prev,
        { rol: 'asistente', texto: data.respuesta || 'Lo siento, no pude obtener una respuesta.' }
      ]);
    } catch {
      setMensajes(prev => [
        ...prev,
        { rol: 'asistente', texto: 'Hubo un error al conectar con el asistente. Intenta de nuevo.' }
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  const limpiar = () =>
    setMensajes([
      {
        rol: 'asistente',
        texto: MENSAJE_ASISTENTE_DESHABILITADO
      }
    ]);

  const SUGERENCIAS = [
    '¿Cómo apelar una sanción?',
    '¿Cómo postular a fondos?',
    '¿Qué es el TRICEL?',
    '¿Qué hace la FEPUCV?'
  ];

  return (
    <>
      <button
        onClick={() => setAbierto(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-fepucv-secondary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-fepucv-primary hover:text-fepucv-secondary transition-all hover:scale-110"
        aria-label="Abrir asistente"
      >
        {abierto ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {abierto && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-fepucv-border flex flex-col overflow-hidden"
          style={{ height: '520px' }}
        >
          <div className="bg-fepucv-secondary px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-fepucv-primary rounded-full flex items-center justify-center font-bold text-fepucv-secondary text-sm shrink-0">
                F
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Asistente FEPUCV</p>
                <p className="text-gray-400 text-xs">En fase de entrenamiento</p>
              </div>
            </div>
            <button
              onClick={limpiar}
              disabled={ASISTENTE_DESHABILITADO}
              className="text-gray-400 hover:text-white transition-colors text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              title={ASISTENTE_DESHABILITADO ? 'Asistente temporalmente deshabilitado' : 'Nueva conversacion'}
            >
              Nueva conv.
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {mensajes.map((msg, i) => (
              <div key={i} className={`flex ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.rol === 'usuario'
                      ? 'bg-fepucv-secondary text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-fepucv-border rounded-bl-sm shadow-sm'
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {msg.texto}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-white border border-fepucv-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-fepucv-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-fepucv-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-fepucv-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {mensajes.length === 1 && !cargando && !ASISTENTE_DESHABILITADO && (
            <div className="px-3 pb-2 pt-1 flex gap-2 flex-wrap bg-gray-50 shrink-0">
              {SUGERENCIAS.map(s => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-xs px-3 py-1.5 bg-white border border-fepucv-border rounded-full text-fepucv-secondary hover:border-fepucv-primary hover:text-fepucv-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-fepucv-border bg-white flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={ASISTENTE_DESHABILITADO ? 'Asistente temporalmente deshabilitado...' : 'Escribe tu pregunta...'}
              disabled={ASISTENTE_DESHABILITADO || cargando}
              className="flex-1 text-sm px-4 py-2.5 rounded-full border border-fepucv-border focus:outline-none focus:border-fepucv-primary bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => enviar()}
              disabled={ASISTENTE_DESHABILITADO || !input.trim() || cargando}
              className="w-10 h-10 bg-fepucv-secondary text-white rounded-full flex items-center justify-center hover:bg-fepucv-primary hover:text-fepucv-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AsistenteChat;
