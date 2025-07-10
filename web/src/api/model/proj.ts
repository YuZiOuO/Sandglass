import type {
  BSONObject,
  datetimeField,
  ObjectID,
} from '../bson_util'
import type { Attachment } from './atmt'
import type {
  Node,
  Task,
} from './node'

interface minimumProject {
  name: string
}

interface optionalProject {
  url: string | undefined
  description: string | undefined
  start_timestamp: number | undefined
  end_timestamp: number | undefined

  tasks: Task[]
  nodes: Node[]
  attachments: Attachment[]
}

interface controlledProject {
  id: string
  owner: string //owner_id
}

interface Project extends minimumProject, optionalProject, controlledProject {}

interface ProjectBSON
  extends Omit<Project, 'owner' | 'start_timestamp' | 'end_timestamp'>,
    BSONObject {
  owner: ObjectID
  end_timestamp: datetimeField
  start_timestamp: datetimeField
}

function parseProject(bson: ProjectBSON): Project {
  return {
    ...bson,
    id: bson._id.$oid,
    owner: bson.owner.$oid,
    start_timestamp: bson.start_timestamp?.$date,
    end_timestamp: bson.end_timestamp?.$date,
    tasks: [],
    nodes: [],
  }
}

export { parseProject }
export type { controlledProject, minimumProject, optionalProject, Project, ProjectBSON }
