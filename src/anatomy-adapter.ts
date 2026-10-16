import { anatomyIndex, leafIds, type AnatomyNode } from './components/ui/anatomy-tree'
import { groups, structures } from './anatomy'

// Scene-specific mapping between the explorer's structures and the registry
// anatomy tree. Group rows are body regions and bone families; they are
// interface groupings, so they are not selectable: activating one expands or collapses it. Leaves carry the same
// colour the 3D mesh uses.

const structureIds = new Set(structures.map(({ id }) => id))

export const allStructureIds = structures.map(({ id }) => id)

export function groupId(group: string): string {
  return `group-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function leaf({ id, name, color }: (typeof structures)[number]): AnatomyNode {
  return { id, label: name, color }
}

// Regions are the first level; inside a region, structures that share a
// subgroup (for example "Carpal bones") are nested one level deeper, in the
// order they first appear.
export const anatomyTree: readonly AnatomyNode[] = groups.map((group) => {
  const members = structures.filter((structure) => structure.group === group)
  const children: AnatomyNode[] = []
  const subgroups = new Map<string, AnatomyNode[]>()
  for (const structure of members) {
    if (!structure.subgroup) {
      children.push(leaf(structure))
      continue
    }
    let list = subgroups.get(structure.subgroup)
    if (!list) {
      list = []
      subgroups.set(structure.subgroup, list)
      children.push({
        id: groupId(`${group} ${structure.subgroup}`),
        label: structure.subgroup,
        selectable: false,
        children: list,
      })
    }
    list.push(leaf(structure))
  }
  return { id: groupId(group), label: group, selectable: false, children }
})

/** Region rows, expanded by default so the panel opens on the region list. */
export const groupIds = anatomyTree.map(({ id }) => id)

const { nodes } = anatomyIndex(anatomyTree)

export function isStructureId(id: string | null): id is string {
  return !!id && structureIds.has(id)
}

/** Scene leaves (GLB structure IDs) represented by a tree row. */
export function sceneIdsForNode(id: string | null): string[] {
  if (!id) return []
  const node = nodes.get(id)
  if (!node) return []
  return leafIds(node).filter((leaf) => structureIds.has(leaf))
}

/** Applies the tree's "missing means visible" contract to every scene leaf. */
export function normalizeVisibility(
  visibility: Readonly<Record<string, boolean>>,
): Record<string, boolean> {
  return Object.fromEntries(allStructureIds.map((id) => [id, visibility[id] !== false]))
}

/** The app's hidden set as the tree's controlled leaf visibility map. */
export function visibilityFromHidden(hidden: ReadonlySet<string>): Record<string, boolean> {
  return Object.fromEntries(
    [...hidden].filter((id) => structureIds.has(id)).map((id) => [id, false]),
  )
}

/** The tree's leaf visibility map back to the app's hidden set. */
export function hiddenFromVisibility(visibility: Readonly<Record<string, boolean>>): Set<string> {
  const normalized = normalizeVisibility(visibility)
  return new Set(allStructureIds.filter((id) => !normalized[id]))
}

export function assertAnatomyMapping(data: readonly AnatomyNode[] = anatomyTree) {
  const leaves = data.flatMap(leafIds)
  const duplicates = leaves.filter((id, index) => leaves.indexOf(id) !== index)
  const missing = allStructureIds.filter((id) => !leaves.includes(id))
  const unknown = leaves.filter((id) => !structureIds.has(id))
  if (duplicates.length || missing.length || unknown.length)
    throw new Error(
      `Invalid anatomy mapping: duplicates=${duplicates.join(',')} missing=${missing.join(',')} unknown=${unknown.join(',')}`,
    )
}

assertAnatomyMapping()
