# 🗄️ Configuración de Supabase MCP Server

## ✅ **Estado de la Configuración**

### **Archivos configurados:**
- ✅ `.mcp.json` - Configuración principal del servidor MCP
- ✅ `.env.mcp` - Variables de entorno con el token

### **Configuración actual:**
- **Proyecto Supabase**: `proyectoboda`
- **Token configurado**: `sbp_c0e1d0a6abc9a8b6a515461482a03ec8125abd4e`
- **Servidor MCP**: `@supabase/mcp-server-supabase@latest`

## 🚀 **Comandos para usar el servidor:**

### **Iniciar el servidor manualmente:**
```bash
$env:SUPABASE_ACCESS_TOKEN="sbp_c0e1d0a6abc9a8b6a515461482a03ec8125abd4e"
npx -y @supabase/mcp-server-supabase@latest --project-ref=proyectoboda
```

### **Verificar conexión:**
```bash
# Cargar variables de entorno desde .env.mcp
Get-Content .env.mcp | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Iniciar servidor
npx -y @supabase/mcp-server-supabase@latest --project-ref=proyectoboda
```

## 📋 **Funcionalidades disponibles:**

Una vez que el servidor MCP esté activo, podrás:

### **Gestión de Base de Datos:**
- 📊 Crear y gestionar tablas
- 🔍 Realizar consultas SQL
- 📝 Insertar, actualizar y eliminar datos
- 🔗 Gestionar relaciones entre tablas

### **Para tu web de boda:**
- 👥 **Tabla de invitados**: Gestión completa de la lista de invitados
- 📧 **RSVPs**: Almacenar confirmaciones de asistencia
- 🎁 **Lista de regalos**: Tracking de regalos comprados/disponibles
- 🏨 **Reservas de alojamiento**: Seguimiento de reservas de hoteles
- 📸 **Galería**: Almacenamiento de imágenes de la boda
- 💬 **Mensajes**: Sistema de mensajes de felicitaciones

## 🔧 **Próximos pasos:**

1. **Verificar que el servidor MCP se conecte correctamente**
2. **Crear el esquema de base de datos para la web de boda**
3. **Integrar las funcionalidades con React**
4. **Configurar las tablas necesarias**

## 📞 **Soporte:**

Si necesitas ayuda adicional:
- Verificar que el proyecto `proyectoboda` existe en Supabase
- Comprobar que el token tiene los permisos necesarios
- Revisar la documentación de Supabase MCP

---

*Configuración completada el 25 de julio, 2025*
