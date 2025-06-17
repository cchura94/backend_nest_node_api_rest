### Modulo users (CRUD)
- Generando el modulo con recurso Api Para Usuario
```
nest g res modules/admin/users
```
- Para validar los datos en los DTOs.
```
npm i --save class-validator class-transformer
``` 
#### Para Cifrado de contraseñas
```
npm i bcrypt
```

```
nest g res modules/admin/roles
nest g res modules/admin/permissions
```
### Módulo inventario
```
nest g module modules/admin/inventario
nest g res modules/admin/inventario/producto
nest g res modules/admin/inventario/categoria
nest g res modules/admin/inventario/almacen
nest g res modules/admin/inventario/sucursal

```

### Swagger
```
npm install --save @nestjs/swagger
```