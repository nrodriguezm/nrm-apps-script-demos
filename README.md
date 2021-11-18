
# Coleccion de ejemplos de Apps Scripts
Ejemplos de scripts para automatizar planillas de GSuite: apps scripts te da alas!

```
Usuarios avanzados usar git + clasp
```

## Leer rss compras estatales de Uruguay

Este script lee el RSS publico disponible de las compras estatales de Uruguay y acumula informacion en una planilla. El RSS publica po defecto 1000 anuncios. El script solo carga nuevos registros en la planilla si el link del llamado aun no esta, si el link ya existe no se duplica el registro.

https://www.comprasestatales.gub.uy/consultas/rss

### TODO

- separar en columnas datos anidados en el texto descripcion
- obtener detalles de las compras abiertas