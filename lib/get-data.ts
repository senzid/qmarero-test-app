
export async function getBillData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const res = await fetch(`${baseUrl}/api/get-bill`, {
    cache: "force-cache",
  })

  if (!res.ok) throw new Error("Error al cargar datos globales")

  return res.json()
}
