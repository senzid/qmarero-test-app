export type HeaderConfig = {
  title: string;
  showBackButton: boolean;
};

export const headerConfig: Record<string, HeaderConfig> = {
  '/': {
    title: 'Pagar la cuenta',
    showBackButton: false,
  },
  '/split-equal': {
    title: 'Dividir por igual',
    showBackButton: true,
  },
  '/split-bill': {
    title: 'Cada uno lo suyo',
    showBackButton: true,
  },
  '/payment': {
    title: 'Pagar la cuenta',
    showBackButton: true,
  },
  '/success': {
    title: 'Pago exitoso',
    showBackButton: false,
  },
};

/**
 * Obtiene la configuración del header para una ruta específica
 * @param pathname - La ruta de la página
 * @param overrides - Configuración opcional para sobrescribir valores por defecto
 * @returns La configuración del header
 */
export function getHeaderConfig(
  pathname: string,
  overrides?: Partial<HeaderConfig>
): HeaderConfig {
  const config = headerConfig[pathname] || {
    title: 'Pagar la cuenta',
    showBackButton: false,
  };

  return {
    ...config,
    ...overrides,
  };
}

