interface ObjectID {
  $oid: string
}

interface BSONObject {
  _id: ObjectID
}

interface datetimeField {
  $date: number
}

export type { BSONObject, ObjectID, datetimeField }
