---
slug: "/articles/restoring-key-in-sublime-text-for-spanish-keyboards"
type: "article"
date: "2012-10-19"
source: ""
title: "Restoring } key in sublime text for spanish keyboards"
link: "/727/restoring-key-in-sublime-text-for-spanish-keyboards"
---

If you use a spanish keyboard and the outstanding editor sublime text 2, you will find press the } key really annoying, because you will get a block comment code instead the } character which it is used "sometimes" when programming.

To fix that just open <em>Preferences &gt; Key Bindings - User menu.</em> That will open a file, there you need to paste the line below inside the [] brackets and save it. You will be able to use } again.
<pre>{ "keys": ["ctrl+alt+/"], "command": "insert", "args": {"characters": "}"}}</pre>
(Spanish) Si empiezas a usar sublime text 2, un editor de código bastante recomendado, para programar con un teclado español, te habrás dado cuenta que cuando pulsas la tecla }, lo que llamamos cerrar la llave y que es bastante útil, en la apantalla aparece un bloque de comentario en vez del símbolo. Para que la tecla funcione correctamente, simplemente tienes que ir al menú <em>Preferences &gt; Key Bindings - User menu </em>y en el archivo que se te abre escribir la linea de arriba entre los corchetes []. Una vez guardado, la tecla volverá a funcionar como debería.