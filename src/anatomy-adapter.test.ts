import { describe, expect, test } from 'bun:test'
import { leafIds, type AnatomyNode } from './components/ui/anatomy-tree'
import {
  anatomyTree,
  assertAnatomyMapping,
  groupIds,
  hiddenFromVisibility,
  normalizeVisibility,
  sceneIdsForNode,
  visibilityFromHidden,
} from './anatomy-adapter'
import { structures } from './anatomy'

const groupRows = (nodes: readonly AnatomyNode[]): AnatomyNode[] =>
  nodes.flatMap((node) => (node.children ? [node, ...groupRows(node.children)] : []))

describe('anatomy tree adapter', () => {
  test('groups every structure exactly once under region rows', () => {
    expect(groupIds).toEqual([
      'group-skull',
      'group-vertebral-column',
      'group-thorax',
      'group-right-upper-limb',
      'group-left-upper-limb',
      'group-pelvis',
      'group-right-lower-limb',
      'group-left-lower-limb',
    ])
    expect(anatomyTree.flatMap(leafIds).sort()).toEqual(structures.map(({ id }) => id).sort())
  })

  test('marks group rows as non-selectable and colours leaves like their meshes', () => {
    const groups = groupRows(anatomyTree)
    expect(new Set(groups.map(({ id }) => id)).size).toBe(groups.length)
    for (const group of groups) {
      expect(group.selectable).toBe(false)
      expect(group.color).toBeUndefined()
      for (const leaf of group.children!.filter((node) => !node.children)) {
        expect(leaf.selectable).toBeUndefined()
        expect(leaf.color).toBe(structures.find(({ id }) => id === leaf.id)!.color)
      }
    }
  })

  test('maps group rows to their scene leaves and leaves to themselves', () => {
    expect(sceneIdsForNode('group-right-upper-limb-carpal-bones')).toEqual([
      'right-scaphoid',
      'right-lunate',
      'right-triquetral',
      'right-pisiform',
      'right-trapezium',
      'right-trapezoid',
      'right-capitate',
      'right-hamate',
    ])
    expect(sceneIdsForNode('group-thorax-right-ribs')).toHaveLength(12)
    expect(sceneIdsForNode('right-femur')).toEqual(['right-femur'])
    expect(sceneIdsForNode('unknown')).toEqual([])
    expect(sceneIdsForNode(null)).toEqual([])
  })

  test('treats missing visibility entries as visible', () => {
    const visibility = normalizeVisibility({ mandible: false })
    expect(visibility.mandible).toBe(false)
    expect(visibility['right-femur']).toBe(true)
    expect(Object.keys(visibility)).toHaveLength(structures.length)
  })

  test('round-trips the hidden set through the tree visibility map', () => {
    const hidden = new Set(['mandible', 'sacrum'])
    const visibility = visibilityFromHidden(hidden)
    expect(visibility).toEqual({ mandible: false, sacrum: false })
    expect(hiddenFromVisibility(visibility)).toEqual(hidden)
    expect(hiddenFromVisibility({ sacrum: true })).toEqual(new Set())
  })

  test('rejects missing, unknown, and duplicate leaves', () => {
    expect(() => assertAnatomyMapping()).not.toThrow()
    const [first, ...rest] = anatomyTree
    expect(() => assertAnatomyMapping(rest)).toThrow(/missing=frontal-bone/)
    expect(() => assertAnatomyMapping([...anatomyTree, { id: 'coccyx', label: 'Coccyx' }])).toThrow(
      /unknown=coccyx/,
    )
    expect(() =>
      assertAnatomyMapping([...anatomyTree, { id: 'g', label: 'Again', children: [first] }]),
    ).toThrow(/duplicates=frontal-bone/)
  })
})
