export type Region =
  | 'Skull'
  | 'Vertebral column'
  | 'Thorax'
  | 'Right upper limb'
  | 'Left upper limb'
  | 'Pelvis'
  | 'Right lower limb'
  | 'Left lower limb'

export type Structure = {
  id: string
  fma: string
  name: string
  /** Label in the source parts list (parts_list_e.txt). */
  sourceName: string
  /** Source STL file name when it differs from the FMA ID. */
  file?: string
  group: Region
  /** Optional second tree level inside the region. */
  subgroup?: string
  color: string
  description: string
  note: string
}

export const anatomySource = 'https://training.seer.cancer.gov/anatomy/skeletal/'

export const groups: readonly Region[] = [
  'Skull',
  'Vertebral column',
  'Thorax',
  'Right upper limb',
  'Left upper limb',
  'Pelvis',
  'Right lower limb',
  'Left lower limb',
]

// Bone is shown in warm ivory tones, slightly varied by region; cartilage and
// discs are a cool grey-blue so they read as a different tissue.
const tones: Record<Region, [string, string]> = {
  Skull: ['#e2d3b6', '#d6c4a2'],
  'Vertebral column': ['#dcc59d', '#cfb68b'],
  Thorax: ['#e6d8bd', '#d9c8a8'],
  'Right upper limb': ['#e0cdaa', '#d2bd97'],
  'Left upper limb': ['#e0cdaa', '#d2bd97'],
  Pelvis: ['#d8c19a', '#cbb188'],
  'Right lower limb': ['#e3d1b0', '#d5c19c'],
  'Left lower limb': ['#e3d1b0', '#d5c19c'],
}
const cartilage = ['#a9c3cb', '#98b5bf']

type Row = {
  fma: string
  source: string
  name?: string
  sub?: string
  text: string
  note?: string
  cartilage?: boolean
  file?: string
}

const ordinals = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
]
const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1)
const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const defaultNote =
  'One surface mesh from an adult male reference model, simplified for the web. Colors are illustrative.'

// ---------------------------------------------------------------- Skull
const skull: Row[] = [
  {
    fma: 'FMA52734',
    source: 'frontal bone',
    sub: 'Cranial bones',
    text: 'Forms the forehead, the roofs of the eye sockets and the front of the cranial vault.',
  },
  ...(['right', 'left'] as const).map((side) => ({
    fma: side === 'right' ? 'FMA52788' : 'FMA52789',
    source: `${side} parietal bone`,
    sub: 'Cranial bones',
    text: 'One of a pair of curved plates forming the top and upper sides of the cranial vault, joined at the sagittal suture.',
  })),
  {
    fma: 'FMA52735',
    source: 'occipital bone',
    sub: 'Cranial bones',
    text: 'Forms the back and base of the skull. The spinal cord passes through its large opening, the foramen magnum, and its condyles rest on the atlas.',
  },
  ...(['right', 'left'] as const).map((side) => ({
    fma: side === 'right' ? 'FMA52738' : 'FMA52739',
    source: `${side} temporal bone`,
    sub: 'Cranial bones',
    text: 'Forms the lower side of the skull. It houses the middle and inner ear and forms the socket of the jaw joint.',
  })),
  {
    fma: 'FMA52736',
    source: 'sphenoid bone',
    sub: 'Cranial bones',
    text: 'A butterfly-shaped bone across the middle of the skull base. It links the cranial and facial bones and cradles the pituitary gland.',
  },
  {
    fma: 'FMA52740',
    source: 'ethmoid',
    name: 'Ethmoid bone',
    sub: 'Cranial bones',
    text: 'A light, air-filled bone between the eye sockets. It forms part of the nasal cavity and the floor of the front of the cranium.',
  },
  ...(['right', 'left'] as const).flatMap((side) => [
    {
      fma: side === 'right' ? 'FMA53647' : 'FMA53648',
      source: `${side} nasal bone`,
      sub: 'Facial bones',
      text: 'One of two small bones forming the bridge of the nose.',
    },
    {
      fma: side === 'right' ? 'FMA53645' : 'FMA53646',
      source: `${side} lacrimal bone`,
      sub: 'Facial bones',
      text: 'The smallest facial bone, in the inner wall of the eye socket. It holds the groove for the tear sac.',
    },
    {
      fma: side === 'right' ? 'FMA52892' : 'FMA52893',
      source: `${side} zygomatic bone`,
      sub: 'Facial bones',
      text: 'The cheekbone. It forms the prominence of the cheek and part of the outer wall and floor of the eye socket.',
    },
    {
      fma: side === 'right' ? 'FMA53649' : 'FMA53650',
      source: `${side} maxilla`,
      sub: 'Facial bones',
      text: 'One half of the upper jaw. It holds the upper teeth and forms most of the hard palate and the floor of the eye socket.',
    },
    {
      fma: side === 'right' ? 'FMA53655' : 'FMA53656',
      source: `${side} palatine bone`,
      sub: 'Facial bones',
      text: 'An L-shaped bone forming the back of the hard palate and part of the nasal cavity wall.',
    },
    {
      fma: side === 'right' ? 'FMA54737' : 'FMA54738',
      source: `${side} inferior nasal concha`,
      sub: 'Facial bones',
      text: 'A thin, scroll-shaped bone on the side wall of the nasal cavity that helps warm and moisten inhaled air.',
    },
  ]),
  {
    fma: 'FMA9710',
    source: 'vomer',
    sub: 'Facial bones',
    text: 'A thin plate forming the back and lower part of the nasal septum.',
  },
  {
    fma: 'FMA52748',
    source: 'mandible',
    sub: 'Facial bones',
    text: 'The lower jaw, the only movable bone of the skull. It holds the lower teeth and hinges at the temporal bones.',
    note: 'One surface mesh; the teeth are not modelled.',
  },
  {
    fma: 'FMA52749',
    source: 'hyoid bone',
    text: 'A U-shaped bone in the neck that touches no other bone. It anchors the tongue and the muscles used in swallowing.',
  },
]

// ---------------------------------------------------------------- Vertebral column
const cervicalIds = [
  'FMA12519',
  'FMA12520',
  'FMA12521',
  'FMA12522',
  'FMA12523',
  'FMA12524',
  'FMA12525',
]
const thoracicIds = [
  'FMA9165',
  'FMA9187',
  'FMA9209',
  'FMA9248',
  'FMA9922',
  'FMA9945',
  'FMA9968',
  'FMA9991',
  'FMA10014',
  'FMA10037',
  'FMA10059',
  'FMA10081',
]
const lumbarIds = ['FMA13072', 'FMA13073', 'FMA13074', 'FMA13075', 'FMA13076']
const discIds: [string, string][] = [
  ['FMA25058', 'axis'],
  ['FMA13896', 'third cervical vertebra'],
  ['FMA13897', 'fourth cervical vertebra'],
  ['FMA13898', 'fifth cervical vertebra'],
  ['FMA13899', 'sixth cervical vertebra'],
  ['FMA13900', 'seventh cervical vertebra'],
  ['FMA10458', 'first thoracic vertebra'],
  ['FMA13495', 'second thoracic vertebra'],
  ['FMA13500', 'third thoracic vertebra'],
  ['FMA13501', 'fourth thoracic vertebra'],
  ['FMA13502', 'fifth thoracic vertebra'],
  ['FMA13503', 'sixth thoracic vertebra'],
  ['FMA13504', 'seventh thoracic vertebra'],
  ['FMA13505', 'eighth thoracic vertebra'],
  ['FMA13506', 'ninth thoracic vertebra'],
  ['FMA13507', 'tenth thoracic vertebra'],
  ['FMA13508', 'eleventh thoracic vertebra'],
  ['FMA13509', 'twelfth thoracic vertebra'],
  ['FMA16033', 'first lumbar vertebra'],
  ['FMA16034', 'second lumbar vertebra'],
  ['FMA16035', 'third lumbar vertebra'],
  ['FMA16036', 'fourth lumbar vertebra'],
  ['FMA16037', 'fifth lumbar vertebra'],
]
// The source names each disc after the vertebra above it.
const levels = [
  ...[2, 3, 4, 5, 6, 7].map((n) => `C${n}`),
  ...ordinals.map((_, i) => `T${i + 1}`),
  ...[1, 2, 3, 4, 5].map((n) => `L${n}`),
  'S1',
]
const spine: Row[] = [
  {
    fma: 'FMA12519',
    source: 'atlas',
    name: 'Atlas (C1)',
    sub: 'Cervical vertebrae',
    text: 'The first cervical vertebra. A ring of bone with no body, it carries the skull and lets the head nod.',
  },
  {
    fma: 'FMA12520',
    source: 'axis',
    name: 'Axis (C2)',
    sub: 'Cervical vertebrae',
    text: 'The second cervical vertebra. Its upward peg, the dens, is the pivot the atlas and head turn around.',
  },
  ...cervicalIds.slice(2).map((fma, i) => ({
    fma,
    source: `${ordinals[i + 2]} cervical vertebra`,
    name: `${capitalize(ordinals[i + 2])} cervical vertebra (C${i + 3})`,
    sub: 'Cervical vertebrae',
    text:
      i === 4
        ? 'The lowest neck vertebra. Its long spinous process is the bump you can feel at the base of the neck.'
        : 'A small neck vertebra. Openings in its transverse processes carry the vertebral arteries up to the brain.',
  })),
  ...thoracicIds.map((fma, i) => ({
    fma,
    source: `${ordinals[i]} thoracic vertebra`,
    name: `${capitalize(ordinals[i])} thoracic vertebra (T${i + 1})`,
    sub: 'Thoracic vertebrae',
    text: 'A vertebra of the upper back. It has facets where the ribs attach, so the thoracic spine moves less than the neck or lower back.',
  })),
  ...lumbarIds.map((fma, i) => ({
    fma,
    source: `${ordinals[i]} lumbar vertebra`,
    name: `${capitalize(ordinals[i])} lumbar vertebra (L${i + 1})`,
    sub: 'Lumbar vertebrae',
    text: 'A large vertebra of the lower back. Its heavy body carries most of the weight of the upper body.',
  })),
  {
    fma: 'FMA16202',
    source: 'sacrum',
    text: 'Five fused vertebrae forming the back of the pelvis. It joins the hip bones at the sacroiliac joints.',
    note: 'The coccyx (tailbone) has no mesh in the source and is not shown.',
  },
  ...discIds.map(([fma, vertebra], i) => ({
    fma,
    source: `intervertebral disk of ${vertebra}`,
    name: `Intervertebral disc ${levels[i]}–${levels[i + 1]}`,
    sub: 'Intervertebral discs',
    cartilage: true,
    text: 'A pad of fibrocartilage between two vertebral bodies. Its tough outer ring and soft core absorb shock and let the spine bend.',
    note: 'The source names each disc after the vertebra above it. Colors are illustrative.',
  })),
]

// ---------------------------------------------------------------- Thorax
const ribIds = {
  right: [
    'FMA7857',
    'FMA7882',
    'FMA7909',
    'FMA7957',
    'FMA8066',
    'FMA8175',
    'FMA8229',
    'FMA8283',
    'FMA8364',
    'FMA8445',
    'FMA8531',
    'FMA8533',
  ],
  left: [
    'FMA7987',
    'FMA8012',
    'FMA8039',
    'FMA8148',
    'FMA8093',
    'FMA8202',
    'FMA8256',
    'FMA8310',
    'FMA8391',
    'FMA8472',
    'FMA8532',
    'FMA8534',
  ],
}
const costalIds = {
  right: ['FMA7875', 'FMA7886', 'FMA7913', 'FMA7976', 'FMA8070', 'FMA8194', 'FMA8248'],
  left: ['FMA8005', 'FMA8031', 'FMA8058', 'FMA8167', 'FMA8112', 'FMA8221', 'FMA8275'],
}
const ribText = (n: number) =>
  n <= 7
    ? 'A true rib: its own costal cartilage joins it directly to the sternum.'
    : n <= 10
      ? 'A false rib: its cartilage joins the cartilage of the rib above instead of the sternum.'
      : 'A floating rib: it ends in the muscles of the flank without reaching the front of the chest.'
const thorax: Row[] = [
  {
    fma: 'FMA7486',
    source: 'manubrium',
    name: 'Manubrium of sternum',
    sub: 'Sternum',
    text: 'The top of the breastbone. The clavicles and first ribs attach to it.',
  },
  {
    fma: 'FMA7487',
    source: 'body of sternum',
    sub: 'Sternum',
    text: 'The long middle part of the breastbone, where the second to seventh costal cartilages attach.',
  },
  {
    fma: 'FMA7488',
    source: 'xiphoid process',
    sub: 'Sternum',
    text: 'The small tip at the bottom of the breastbone. Some abdominal muscles and the diaphragm attach to it.',
  },
  ...(['right', 'left'] as const).flatMap((side) =>
    ribIds[side].map((fma, i) => ({
      fma,
      source: `${side} ${ordinals[i]} rib`,
      sub: `${capitalize(side)} ribs`,
      text: ribText(i + 1),
    })),
  ),
  ...(['right', 'left'] as const).flatMap((side) => [
    ...costalIds[side].map((fma, i) => ({
      fma,
      source: `${side} ${ordinals[i]} costal cartilage`,
      sub: 'Costal cartilages',
      cartilage: true,
      text: 'A bar of hyaline cartilage joining a rib to the sternum. Its flexibility lets the chest expand when you breathe.',
    })),
    {
      fma: side === 'right' ? 'BP28' : 'BP24',
      source: `${side} costal cartilage`,
      name: `${capitalize(side)} lower costal cartilages`,
      sub: 'Costal cartilages',
      cartilage: true,
      text: 'The cartilages of the eighth to tenth ribs, which join one another and the seventh cartilage to form the lower edge of the rib cage, the costal margin.',
      note: 'The source labels this mesh only as a costal cartilage; that it represents the eighth to tenth is inferred from its position below the seventh. Colors are illustrative.',
    },
  ]),
]

// ---------------------------------------------------------------- Limbs
const fingers = ['thumb', 'index finger', 'middle finger', 'ring finger', 'little finger']
const toes = ['big toe', 'second toe', 'third toe', 'fourth toe', 'little toe']
const handPhalanges: Record<'right' | 'left', Record<string, string[]>> = {
  // proximal, middle (none for thumb), distal
  right: {
    proximal: ['FMA24450', 'FMA24451', 'FMA24452', 'FMA24453', 'FMA24454'],
    middle: ['', 'FMA24455', 'FMA24456', 'FMA24457', 'FMA24458'],
    distal: ['FMA24459', 'FMA24460', 'FMA24461', 'FMA24462', 'FMA24463'],
  },
  left: {
    proximal: ['FMA65470', 'FMA71915', 'FMA71908', 'FMA71916', 'FMA66791'],
    middle: ['', 'FMA23938', 'FMA23940', 'FMA23942', 'FMA23944'],
    distal: ['FMA23951', 'FMA23953', 'FMA23955', 'FMA23957', 'FMA23959'],
  },
}
const footPhalanges: Record<'right' | 'left', Record<string, string[]>> = {
  right: {
    proximal: ['FMA43253', 'FMA32634', 'FMA32636', 'FMA32638', 'FMA32640'],
    middle: ['', 'FMA32642', 'FMA32644', 'FMA32646', 'FMA230986'],
    distal: ['FMA32650', 'FMA32652', 'FMA32654', 'FMA32656', 'FMA32658'],
  },
  left: {
    proximal: ['FMA43254', 'FMA32635', 'FMA32637', 'FMA32639', 'FMA32641'],
    middle: ['', 'FMA32643', 'FMA32645', 'FMA32647', 'FMA230988'],
    distal: ['FMA32651', 'FMA32653', 'FMA32655', 'FMA32657', 'FMA32659'],
  },
}
const phalanxText = {
  proximal: 'The phalanx nearest the palm or sole, hinged to a metacarpal or metatarsal.',
  middle: 'The middle of the three phalanges of a finger or lesser toe.',
  distal: 'The fingertip or toe-tip bone. Its flattened end supports the nail.',
}
const sides = ['right', 'left'] as const

function upperLimb(side: 'right' | 'left'): Row[] {
  const id = (right: string, left: string) => (side === 'right' ? right : left)
  return [
    {
      fma: id('FMA13322', 'FMA13323'),
      source: `${side} clavicle`,
      sub: 'Shoulder girdle',
      text: 'The collarbone. An S-shaped strut between the sternum and the scapula that holds the shoulder out from the chest.',
    },
    {
      fma: id('FMA13395', 'FMA13396'),
      source: `${side} scapula`,
      sub: 'Shoulder girdle',
      text: 'The shoulder blade. A flat triangular bone on the back of the rib cage; its shallow socket holds the head of the humerus.',
    },
    {
      fma: id('FMA23130', 'FMA23131'),
      source: `${side} humerus`,
      sub: 'Arm and forearm',
      text: 'The upper arm bone, from the shoulder joint to the elbow.',
    },
    {
      fma: id('FMA23464', 'FMA23465'),
      source: `${side} radius`,
      sub: 'Arm and forearm',
      text: 'The forearm bone on the thumb side. It rotates around the ulna to turn the palm up or down.',
    },
    {
      fma: id('FMA23467', 'FMA23468'),
      source: `${side} ulna`,
      sub: 'Arm and forearm',
      text: 'The forearm bone on the little-finger side. Its hooked upper end forms the point of the elbow.',
    },
    ...(
      [
        [
          'scaphoid',
          'FMA24435',
          'FMA24436',
          'The largest bone of the first carpal row, on the thumb side; the most commonly fractured wrist bone.',
        ],
        [
          'lunate',
          'FMA24437',
          'FMA24438',
          'A crescent-shaped bone in the middle of the first carpal row, between the scaphoid and triquetral.',
        ],
        [
          'triquetral',
          'FMA24439',
          'FMA24440',
          'A pyramid-shaped bone of the first carpal row on the little-finger side.',
        ],
        [
          'pisiform',
          'FMA24441',
          'FMA24442',
          'A small pea-shaped bone on the front of the triquetral, inside the tendon of a wrist flexor.',
        ],
        [
          'trapezium',
          'FMA24443',
          'FMA24444',
          'The carpal bone at the base of the thumb; its saddle-shaped joint gives the thumb its wide range of movement.',
        ],
        [
          'trapezoid',
          'FMA23725',
          'FMA24445',
          'A small wedge-shaped carpal bone at the base of the index finger.',
        ],
        [
          'capitate',
          'FMA24446',
          'FMA24447',
          'The largest carpal bone, at the centre of the wrist below the middle finger.',
        ],
        [
          'hamate',
          'FMA24448',
          'FMA24449',
          'A carpal bone on the little-finger side with a hook that forms one wall of the carpal tunnel.',
        ],
      ] as const
    ).map(([bone, right, left, text]) => ({
      fma: id(right, left),
      source: `${side} ${bone}`,
      sub: 'Carpal bones',
      text,
    })),
    ...[
      ['FMA24464', 'FMA24465'],
      ['FMA24466', 'FMA24467'],
      ['FMA24468', 'FMA24469'],
      ['FMA24470', 'FMA24471'],
      ['FMA24472', 'FMA24473'],
    ].map(([right, left], i) => ({
      fma: id(right, left),
      source: `${side} ${ordinals[i]} metacarpal bone`,
      sub: 'Metacarpal bones',
      text: `A long bone of the palm leading to the ${fingers[i]}. Its rounded head forms a knuckle.`,
    })),
    ...(['proximal', 'middle', 'distal'] as const).flatMap((row) =>
      handPhalanges[side][row].flatMap((fma, i) =>
        fma
          ? [
              {
                fma,
                source: `${row} phalanx of ${side} ${fingers[i]}`,
                name: `${capitalize(side)} ${fingers[i]}, ${row} phalanx`,
                sub: 'Phalanges of the hand',
                text:
                  i === 0 && row !== 'middle'
                    ? `${phalanxText[row]} The thumb has only two phalanges.`
                    : phalanxText[row],
              },
            ]
          : [],
      ),
    ),
  ]
}

function lowerLimb(side: 'right' | 'left'): Row[] {
  const id = (right: string, left: string) => (side === 'right' ? right : left)
  return [
    {
      fma: id('FMA24474', 'FMA24475'),
      source: `${side} femur`,
      sub: 'Thigh and leg',
      text: 'The thigh bone, the longest and strongest bone in the body. Its ball-shaped head fits the hip socket.',
    },
    {
      fma: id('FMA24486', 'FMA24487'),
      source: `${side} patella`,
      sub: 'Thigh and leg',
      text: 'The kneecap, a sesamoid bone inside the quadriceps tendon that protects the knee and improves the muscle’s leverage.',
    },
    {
      fma: id('FMA24477', 'FMA24478'),
      source: `${side} tibia`,
      sub: 'Thigh and leg',
      text: 'The shinbone. The larger lower-leg bone, it carries the body’s weight from the knee to the ankle.',
    },
    {
      fma: id('FMA24480', 'FMA24481'),
      source: `${side} fibula`,
      sub: 'Thigh and leg',
      text: 'The slender outer bone of the lower leg. It anchors muscles and forms the outer ankle bump.',
    },
    ...(
      [
        [
          'talus',
          'FMA24482',
          'FMA24483',
          'The ankle bone that sits between the tibia, fibula and calcaneus, transferring weight from the leg to the foot.',
        ],
        [
          'calcaneus',
          'FMA24497',
          'FMA24498',
          'The heel bone, the largest bone of the foot. The Achilles tendon attaches to its back.',
        ],
        [
          'navicular',
          'FMA24500',
          'FMA24501',
          'A boat-shaped bone on the inner side of the foot, in front of the talus.',
          'navicular bone of SIDE foot',
        ],
        [
          'cuboid',
          'FMA24528',
          'FMA24529',
          'A cube-shaped bone on the outer side of the foot, in front of the calcaneus.',
          'SIDE cuboid bone',
        ],
        [
          'medial cuneiform',
          'FMA24521',
          'FMA24522',
          'The largest of the three wedge-shaped cuneiform bones, at the base of the big toe’s metatarsal.',
          'SIDE medial cuneiform bone',
        ],
        [
          'intermediate cuneiform',
          'FMA24523',
          'FMA24524',
          'The smallest cuneiform bone, at the base of the second metatarsal.',
          'SIDE intermediate cuneiform bone',
        ],
        [
          'lateral cuneiform',
          'FMA24525',
          'FMA24526',
          'The cuneiform bone at the base of the third metatarsal, beside the cuboid.',
          'SIDE lateral cuneiform bone',
        ],
      ] as [string, string, string, string, string?][]
    ).map(([bone, right, left, text, source]) => ({
      fma: id(right, left),
      source: source ? source.replace('SIDE', side) : `${side} ${bone}`,
      name: `${capitalize(side)} ${bone}`,
      sub: 'Tarsal bones',
      text,
    })),
    ...[
      ['FMA24507', 'FMA24508'],
      ['FMA24509', 'FMA24510'],
      ['FMA24511', 'FMA24512'],
      ['FMA24513', 'FMA24514'],
      ['FMA24515', 'FMA24516'],
    ].map(([right, left], i) => ({
      fma: id(right, left),
      source: `${side} ${ordinals[i]} metatarsal bone`,
      sub: 'Metatarsal bones',
      text: `A long bone of the foot leading to the ${toes[i]}. The metatarsal heads form the ball of the foot.`,
    })),
    ...(['proximal', 'middle', 'distal'] as const).flatMap((row) =>
      footPhalanges[side][row].flatMap((fma, i) =>
        fma
          ? [
              {
                fma,
                source: `${row} phalanx of ${side} ${toes[i]}`,
                name: `${capitalize(side)} ${toes[i]}, ${row} phalanx`,
                sub: 'Phalanges of the foot',
                text:
                  i === 0
                    ? `${phalanxText[row]} The big toe has only two phalanges.`
                    : phalanxText[row],
              },
            ]
          : [],
      ),
    ),
    {
      fma: id('FMA45097', 'FMA45098'),
      source: `sesamoid bone of ${side} foot`,
      name: `${capitalize(side)} sesamoid bones of the foot`,
      text: 'Small bones embedded in tendons under the head of the first metatarsal. They protect the tendons and help the big toe push off.',
      note: 'The source gives the sesamoid bones of each foot as one mesh. Colors are illustrative.',
    },
  ]
}

const pelvis: Row[] = sides.map((side) => ({
  fma: side === 'right' ? 'FMA16586' : 'FMA16587',
  source: `${side} hip bone`,
  text: 'Formed by the ilium, ischium and pubis fused together. It carries the hip socket and joins the sacrum behind and the other hip bone in front.',
  note: 'One surface mesh; the ilium, ischium and pubis are not separate structures. Colors are illustrative.',
}))

const rows: [Region, Row[]][] = [
  ['Skull', skull],
  ['Vertebral column', spine],
  ['Thorax', thorax],
  ['Right upper limb', upperLimb('right')],
  ['Left upper limb', upperLimb('left')],
  ['Pelvis', pelvis],
  ['Right lower limb', lowerLimb('right')],
  ['Left lower limb', lowerLimb('left')],
]

export const structures: Structure[] = rows.flatMap(([group, list]) =>
  list.map((row, i) => ({
    id: slug(row.name ?? row.source),
    fma: row.fma,
    name: row.name ?? capitalize(row.source),
    sourceName: row.source,
    ...(row.file ? { file: row.file } : {}),
    group,
    ...(row.sub ? { subgroup: row.sub } : {}),
    color: (row.cartilage ? cartilage : tones[group])[i % 2],
    description: row.text,
    note: row.note ?? defaultNote,
  })),
)

export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))

export type View =
  | 'Anterior'
  | 'Posterior'
  | 'Right lateral'
  | 'Skull'
  | 'Thorax'
  | 'Spine'
  | 'Right hand'
  | 'Right foot'

// Whole-body views fit the full skeleton; regional views fit only the listed
// structures so small bones such as the hand fill the stage.
export const views: { view: View; direction: [number, number, number]; region?: string[] }[] = [
  { view: 'Anterior', direction: [0, 0, 1] },
  { view: 'Posterior', direction: [0, 0, -1] },
  { view: 'Right lateral', direction: [-1, 0, 0] },
  { view: 'Skull', direction: [-0.55, 0.1, 1], region: ['Skull'] },
  { view: 'Thorax', direction: [0, 0.15, 1], region: ['Thorax'] },
  { view: 'Spine', direction: [-0.45, 0, -1], region: ['Vertebral column'] },
  { view: 'Right hand', direction: [0, 0, 1], region: ['Right upper limb:hand'] },
  { view: 'Right foot', direction: [-0.6, 0.8, 0.9], region: ['Right lower limb:foot'] },
]

const handSubgroups = ['Carpal bones', 'Metacarpal bones', 'Phalanges of the hand']
const footSubgroups = ['Tarsal bones', 'Metatarsal bones', 'Phalanges of the foot']
/** Structures a regional view frames; every structure for whole-body views. */
export function inView(structure: Structure, view: View): boolean {
  const region = views.find((v) => v.view === view)?.region
  if (!region) return true
  return region.some((r) => {
    const [group, part] = r.split(':')
    if (structure.group !== group) return false
    if (part === 'hand') return handSubgroups.includes(structure.subgroup ?? '')
    if (part === 'foot')
      return footSubgroups.includes(structure.subgroup ?? '') || !structure.subgroup
    return true
  })
}

export const defaultView: View = 'Anterior'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'right-femur',
    title: 'About 200 bones',
    text: 'An adult skeleton has about 206 bones. The femur, highlighted here, is the longest. The skull, spine and rib cage form the central axis; the limbs and their girdles hang from it.',
    view: 'Anterior',
  },
  {
    id: 'mandible',
    title: 'The skull',
    text: 'The skull is made of cranial bones that enclose the brain and facial bones that shape the face. The mandible is the only one that moves.',
    view: 'Skull',
  },
  {
    id: 'body-of-sternum',
    title: 'The rib cage',
    text: 'Twelve pairs of ribs curve from the spine to the front of the chest. Costal cartilages, shown blue-grey, join the upper seven pairs to the sternum.',
    view: 'Thorax',
  },
  {
    id: 'first-lumbar-vertebra-l1',
    title: 'The vertebral column',
    text: 'From behind you can follow the 24 vertebrae from the skull down to the sacrum: seven in the neck, twelve carrying the ribs and five large lumbar vertebrae. Discs between their bodies absorb shock.',
    view: 'Spine',
  },
  {
    id: 'right-scaphoid',
    title: 'Hands and feet',
    text: 'More than half of the body’s bones are in the hands and feet. Each wrist has eight carpal bones; the scaphoid, highlighted, links its two rows.',
    view: 'Right hand',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry.
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
