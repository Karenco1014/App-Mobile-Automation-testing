import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'android',
      use: {
        ...require('playwright').devices['Pixel_3'],
        permissions: ['android.permission.INTERNET'],  // Puedes agregar más permisos según sea necesario
        locale: 'es-US',  // Puedes ajustar la configuración de idioma según sea necesario
        // Agrega más configuraciones específicas aquí
      },
    },
    // Agrega más proyectos para otros navegadores o configuraciones
  ],
  // Otras configuraciones generales...
});
