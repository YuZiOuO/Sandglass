import { apiEncode } from "./api"

export function get_proj(id: string) {
  apiEncode().get('/proj',{params:{}})
}
