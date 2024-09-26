import { useMutation } from "react-query"
import { get, post } from "."

export function fetchRegister() {
  return useMutation((data: any) => post("/register", data))
}

export function fetchDelete() {
  return useMutation((data: any) => get(`/delete?id=${data}`))
}

export function fetchQuery() {
  return useMutation((data: any) => post("/phoneQuery", data))
}
