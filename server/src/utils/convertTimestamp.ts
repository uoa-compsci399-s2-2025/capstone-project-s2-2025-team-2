export function convertTimestamp(data: any): any {
     const result:any = { ...data}

     for (const key in result) {
          const value =result[key]
          if (value && typeof value.toDate === "function") {
               result[key] = value.toDate().toISOString()
          }
     }
     return result
}