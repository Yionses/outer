import { fetchMaterial, fetchSpecifications } from "@/apis/apis"
import { useEffect } from "react"

export default function Query() {
  const { mutateAsync } = fetchMaterial()
  const { mutateAsync: fetchSpecification } = fetchSpecifications()
  useEffect(() => {
    async function getData() {
      const res = await mutateAsync()
      const res2 = await fetchSpecification({ material: res?.[6] })
      console.log(res, res2)
    }
    getData()
  }, [])
  return <>查询</>
}
