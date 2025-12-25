import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getBillData() {
  // Durante el build o cuando no hay servidor disponible, leer directamente el archivo para evita errores de ECONNREFUSED durante el build estático
  try {
    const filePath = join(process.cwd(), 'data', 'bill.json');
    const fileContents = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!baseUrl) {
      throw new Error("Error al cargar datos globales: no hay API URL configurada");
    }
    
    const res = await fetch(`${baseUrl}/api/get-bill`, {
      cache: "force-cache",
    });

    if (!res.ok) throw new Error("Error al cargar datos globales");

    return res.json();
  }
}
