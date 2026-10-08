import type { Critter } from './critters';

export type Reward = {
  // Site-root path (e.g. "/rewards/dino/sauropod-3d.png"); use rewardSrc() to add BASE_URL.
  src: string;
  alt: string;
  credit?: { name: string; url: string; site: 'Unsplash' | 'Pexels' };
};

// Images live in public/rewards/<critter>/. Photo credits: public/rewards/CREDITS.md.
export const REWARDS: Record<Critter, Reward[]> = {
  cat: [
    {
      src: '/rewards/cat/cat-01.jpg',
      alt: 'A cute tabby kitten sitting on speckled floor',
      credit: {
        name: 'Edgar',
        url: 'https://unsplash.com/photos/nKC772R_qog',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-02.jpg',
      alt: 'A cute fluffy ginger kitten on bed',
      credit: {
        name: 'Mike Stimpson',
        url: 'https://unsplash.com/photos/zXunvWE06IE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-03.jpg',
      alt: 'A cute tabby-and-white kitten on wood floor',
      credit: {
        name: 'Onur Binay',
        url: 'https://unsplash.com/photos/E18nZ_OHh04',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-04.jpg',
      alt: 'A cute blue-eyed colourpoint kitten at window',
      credit: {
        name: 'Leonsa',
        url: 'https://unsplash.com/photos/fVNyjet1CXY',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-05.jpg',
      alt: 'A cute fluffy tabby kitten close-up',
      credit: {
        name: 'little plant',
        url: 'https://unsplash.com/photos/j9laGeFxPwo',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-06.jpg',
      alt: 'A cute tabby kitten on pink blanket',
      credit: {
        name: 'Tuqa Nabi',
        url: 'https://unsplash.com/photos/WHTLPrTPBk0',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-07.jpg',
      alt: 'A cute tabby-and-white kitten on floral duvet',
      credit: {
        name: 'Timur M',
        url: 'https://unsplash.com/photos/SAKLELG-pO8',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-08.jpg',
      alt: 'A cute golden kitten raising paw, mint backdrop',
      credit: {
        name: 'Alvan Nee',
        url: 'https://unsplash.com/photos/ZCHj_2lJP00',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-09.jpg',
      alt: 'A cute ginger kitten on grey blanket',
      credit: {
        name: 'Diana Parkhouse',
        url: 'https://unsplash.com/photos/r0XRumv-I2k',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-10.jpg',
      alt: 'A cute tortie-tabby kitten sitting on cushion',
      credit: {
        name: 'Bryan Debin',
        url: 'https://unsplash.com/photos/nH2tftGLScs',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-11.jpg',
      alt: 'A cute tiny ginger kitten peeking over ledge',
      credit: {
        name: 'Martin de Arriba',
        url: 'https://unsplash.com/photos/mpTdfoVQPuA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-12.jpg',
      alt: 'A cute golden cat lounging in woven basket',
      credit: {
        name: 'Daria Averina',
        url: 'https://unsplash.com/photos/_867Jy8LCkI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-13.jpg',
      alt: 'A cute calico kitten looking up',
      credit: {
        name: 'Elodie Oudot',
        url: 'https://unsplash.com/photos/CVtF_ELmk30',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-14.jpg',
      alt: 'A cute kitten climbing grey sofa',
      credit: {
        name: 'Tran Mau Tri Tam',
        url: 'https://unsplash.com/photos/-81lVsfM4gQ',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-15.jpg',
      alt: 'A cute blue-eyed ragdoll lounging on white',
      credit: {
        name: 'Esteban Chinchilla',
        url: 'https://unsplash.com/photos/DwkgUqRcHrA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-16.jpg',
      alt: 'A cute fluffy white kitten on piano keys',
      credit: {
        name: 'Michael Michael',
        url: 'https://unsplash.com/photos/e-MuUrRBCM4',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-17.jpg',
      alt: 'A cute white kitten waving paw',
      credit: {
        name: 'Bofu Shaw',
        url: 'https://unsplash.com/photos/rC--YcGXrOg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-18.jpg',
      alt: 'A cute ginger maine coon stretching on table',
      credit: {
        name: 'Amber Kipp',
        url: 'https://unsplash.com/photos/75715CVEJhI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-19.jpg',
      alt: 'A cute calico cat rolling on white sheets',
      credit: {
        name: 'Anton Lochov',
        url: 'https://unsplash.com/photos/_b020HIGZUE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-20.jpg',
      alt: 'A cute white cat trotting with tail up',
      credit: {
        name: 'Mathieu Odin',
        url: 'https://unsplash.com/photos/YeQIAysCP3w',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-21.jpg',
      alt: 'A cute ginger kitten in green grass',
      credit: {
        name: 'Andriyko Podilnyk',
        url: 'https://unsplash.com/photos/RCfi7vgJjUY',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-22.jpg',
      alt: 'A cute grinning tabby cat in yellow bandana',
      credit: {
        name: 'Jae Park',
        url: 'https://unsplash.com/photos/7GX5aICb5i4',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-23.jpg',
      alt: 'A cute black and tuxedo kittens looking up',
      credit: {
        name: 'nicola dowie',
        url: 'https://unsplash.com/photos/og9hnkB6NZ8',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-24.jpg',
      alt: 'A cute black kitten snuggled in blankets',
      credit: {
        name: 'Nenad Novaković',
        url: 'https://unsplash.com/photos/G0ra0LeBpZM',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-25.jpg',
      alt: 'A cute black cat against blue wall',
      credit: {
        name: 'Gio Bartlett',
        url: 'https://unsplash.com/photos/gOMrZXQfZKc',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-26.jpg',
      alt: 'A cute grey kitten on blue cushion',
      credit: {
        name: 'Jonathan Falcon',
        url: 'https://unsplash.com/photos/i6_Wl1AJtqk',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-27.jpg',
      alt: 'A cute blue-eyed grey kitten between trees',
      credit: {
        name: 'areej fateyma',
        url: 'https://unsplash.com/photos/8ornAMZ_gBg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-29.jpg',
      alt: 'A cute orange-eyed british blue kitten by window',
      credit: {
        name: 'Felice Wölke',
        url: 'https://unsplash.com/photos/Mor1tZaRHWY',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-30.jpg',
      alt: 'A cute grey tabby kitten over chair back',
      credit: {
        name: 'Shayna Douglas',
        url: 'https://unsplash.com/photos/ABF49IY_2-o',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/cat/cat-31.jpg',
      alt: 'A cute two kittens in grass',
      credit: {
        name: 'Rhys Abel',
        url: 'https://www.pexels.com/photo/kittens-in-grass-16390929/',
        site: 'Pexels',
      },
    },
  ],
  dog: [
    {
      src: '/rewards/dog/dog-01.jpg',
      alt: 'A cute smiling pomeranian on stone steps',
      credit: {
        name: 'FLOUFFY',
        url: 'https://unsplash.com/photos/VBkIK3qj3QE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-02.jpg',
      alt: 'A cute white fluffy puppy on autumn leaves',
      credit: {
        name: 'Cristina Anne Costello',
        url: 'https://unsplash.com/photos/NR2eMg9zXxA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-03.jpg',
      alt: 'A cute golden retriever puppy on grass',
      credit: {
        name: 'PartTime Portraits',
        url: 'https://unsplash.com/photos/atOlntWcO4k',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-04.jpg',
      alt: 'A cute cavalier puppy peeking over blanket',
      credit: {
        name: 'T.R Photography',
        url: 'https://unsplash.com/photos/TzjMd7i5WQI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-05.jpg',
      alt: 'A cute golden puppy with collar lying down',
      credit: {
        name: 'Bill Stephan',
        url: 'https://unsplash.com/photos/9LkqymZFLrE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-06.jpg',
      alt: 'A cute shaggy small dog on green backdrop',
      credit: {
        name: 'Karsten Winegeart',
        url: 'https://unsplash.com/photos/nwe2qgAhT4k',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-07.jpg',
      alt: 'A cute golden puppy licking its nose',
      credit: {
        name: 'Olga Andreyanova',
        url: 'https://unsplash.com/photos/XeOO8ir_YHs',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-08.jpg',
      alt: 'A cute boxer puppy lying on carpet',
      credit: {
        name: 'Clarke Sanders',
        url: 'https://unsplash.com/photos/nM4gJR-7RWQ',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-09.jpg',
      alt: 'A cute blue-merle aussie puppy lying down',
      credit: {
        name: 'mtsjrdl',
        url: 'https://unsplash.com/photos/5yAhL8ViUVg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-10.jpg',
      alt: 'A cute happy cavapoo puppy, tongue out',
      credit: {
        name: 'Roberto Nickson',
        url: 'https://unsplash.com/photos/9sAZFxLGSbE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-11.jpg',
      alt: 'A cute scruffy doodle puppy on wood floor',
      credit: {
        name: 'David Vives',
        url: 'https://unsplash.com/photos/5j4bu68ltyk',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-12.jpg',
      alt: 'A cute brown puppy resting on patterned blanket',
      credit: {
        name: 'Joy Christian',
        url: 'https://unsplash.com/photos/nhHx-_zsesc',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-13.jpg',
      alt: 'A cute cavalier spaniel standing in garden',
      credit: {
        name: 'Courtney Mihaka',
        url: 'https://unsplash.com/photos/8rdX9FraXug',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-14.jpg',
      alt: 'A cute golden puppy sitting in snow',
      credit: {
        name: 'Shayna Douglas',
        url: 'https://unsplash.com/photos/w2tG22s8hEc',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-15.jpg',
      alt: 'A cute puppy asleep paws-up in blanket',
      credit: {
        name: 'Isabela Kronemberger',
        url: 'https://unsplash.com/photos/m8v7BDLV8yE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-16.jpg',
      alt: 'A cute german shepherd puppy on grass',
      credit: {
        name: 'Alexander Naglestad',
        url: 'https://unsplash.com/photos/HXJs7qJn0sI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-17.jpg',
      alt: 'A cute smiling border collie',
      credit: {
        name: 'Baptist Standaert',
        url: 'https://unsplash.com/photos/mx0DEnfYxic',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-18.jpg',
      alt: 'A cute happy beagle close-up',
      credit: {
        name: 'Milli',
        url: 'https://unsplash.com/photos/2l0CWTpcChI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-19.jpg',
      alt: 'A cute grinning aussie at beach',
      credit: {
        name: 'Pauline Loroy',
        url: 'https://unsplash.com/photos/U3aF7hgUSrk',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-20.jpg',
      alt: 'A cute happy red retriever on trail',
      credit: {
        name: 'Jamie Street',
        url: 'https://unsplash.com/photos/UtrE5DcgEyg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-21.jpg',
      alt: 'A cute smiling yellow labrador looking up',
      credit: {
        name: 'Noémi Macavei-Katócz',
        url: 'https://unsplash.com/photos/c7bUIRBqapA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-22.jpg',
      alt: 'A cute dog bounding through yellow flowers',
      credit: {
        name: 'Rafaëlla Waasdorp',
        url: 'https://unsplash.com/photos/EkzMdwI_YE4',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-23.jpg',
      alt: 'A cute fluffy white puppy running, ears flying',
      credit: {
        name: 'Joe Caione',
        url: 'https://unsplash.com/photos/qO-PIF84Vxg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-24.jpg',
      alt: 'A cute miniature pinscher waving a paw',
      credit: {
        name: 'Amie Barron',
        url: 'https://unsplash.com/photos/hz_BchTSLX8',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-25.jpg',
      alt: 'A cute grinning tricolour dog on bed',
      credit: {
        name: 'Kara Eads',
        url: 'https://unsplash.com/photos/a_vtzmoMNI0',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-26.jpg',
      alt: 'A cute smiling golden retriever, studio white',
      credit: {
        name: 'Faber Leonardo',
        url: 'https://unsplash.com/photos/CLhFS67ni1c',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-27.jpg',
      alt: 'A cute corgi puppy on orange backdrop',
      credit: {
        name: 'Alvan Nee',
        url: 'https://unsplash.com/photos/9M0tSjb-cpA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-28.jpg',
      alt: 'A cute tricolour corgi puppy in sunbeam',
      credit: {
        name: 'Brandon Cormier',
        url: 'https://unsplash.com/photos/oyjgqESgg4g',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-29.jpg',
      alt: 'A cute husky puppy trotting through woods',
      credit: {
        name: 'Cody Board',
        url: 'https://unsplash.com/photos/tnNVJd_nrw8',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-30.jpg',
      alt: 'A cute blue-eyed husky puppy on grass',
      credit: {
        name: 'Andriyko Podilnyk',
        url: 'https://unsplash.com/photos/PAeIh77Fncg',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/dog/dog-32.jpg',
      alt: 'A cute red dachshund looking up at camera',
      credit: {
        name: 'Max Bvp',
        url: 'https://unsplash.com/photos/vsjREZvQkJw',
        site: 'Unsplash',
      },
    },
  ],
  dino: [
    // Public domain (publicdomainpictures.net) — see public/rewards/CREDITS.md
    { src: '/rewards/dino/dino-01.jpg', alt: 'A cute green baby dinosaur hatching from a blue egg' },
    { src: '/rewards/dino/dino-02.jpg', alt: 'A cute orange baby dinosaur giggling in its egg' },
    { src: '/rewards/dino/dino-03.jpg', alt: 'A cute teal baby dinosaur laughing in a cracked egg' },
    { src: '/rewards/dino/dino-04.jpg', alt: 'A soft blue watercolour baby dinosaur' },
    { src: '/rewards/dino/dino-05.jpg', alt: 'A pink watercolour dinosaur with hearts' },
    { src: '/rewards/dino/dino-06.jpg', alt: 'A cute green cartoon dinosaur with rosy cheeks' },
  ],
  monkey: [
    {
      src: '/rewards/monkey/monkey-01.jpg',
      alt: 'A cute two baby macaques on a log',
      credit: {
        name: 'Brian Mann',
        url: 'https://unsplash.com/photos/aXqlZFeVFrU',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-02.jpg',
      alt: 'A cute baby macaque resting on branch',
      credit: {
        name: 'Jamie Haughton',
        url: 'https://unsplash.com/photos/Z05GiksmqYU',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-03.jpg',
      alt: 'A cute baby rhesus macaque sitting upright',
      credit: {
        name: 'Bob Brewer',
        url: 'https://unsplash.com/photos/daC7ji1EMHM',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-04.jpg',
      alt: 'A cute young macaque nibbling snack',
      credit: {
        name: 'Patrick Beznoska',
        url: 'https://unsplash.com/photos/4P702ZWSrHI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-05.jpg',
      alt: 'A cute bonnet macaque perched in rain',
      credit: {
        name: 'Saiteja Varma',
        url: 'https://unsplash.com/photos/ZZqZM2rwGLc',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-06.jpg',
      alt: 'A cute baby macaque snacking beside mum',
      credit: {
        name: 'Joseph Anson',
        url: 'https://unsplash.com/photos/93vFp8K3GKA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-07.jpg',
      alt: 'A cute young rhesus macaque sitting on rock',
      credit: {
        name: 'prathap karaka',
        url: 'https://unsplash.com/photos/ftbu3iLsjAY',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-10.jpg',
      alt: 'A cute baby bonnet macaque on leafy branch',
      credit: {
        name: 'Himanshu Choudhary',
        url: 'https://unsplash.com/photos/xmjgBf02bp4',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-11.jpg',
      alt: 'A cute cheeky baby macaque, tongue out',
      credit: {
        name: 'Katarzyna Zygnerska',
        url: 'https://unsplash.com/photos/BO1-MxgU1Co',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-13.jpg',
      alt: 'A cute baby baboon lazily hanging from branch',
      credit: {
        name: 'Michael Jerrard',
        url: 'https://unsplash.com/photos/10eCyAKcXYk',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-14.jpg',
      alt: 'A cute squirrel monkey in tree fork',
      credit: {
        name: 'Diego Guzmán',
        url: 'https://unsplash.com/photos/u_4bPYOXujE',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-15.jpg',
      alt: 'A cute vervet monkey on branch',
      credit: {
        name: 'Ivan Sabayuki',
        url: 'https://unsplash.com/photos/kYiUiDGSTZo',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-16.jpg',
      alt: 'A cute snow monkey soaking in hot spring',
      credit: {
        name: 'Steven Diaz',
        url: 'https://unsplash.com/photos/Shuj-9LqHwk',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-17.jpg',
      alt: 'A cute fluffy snow monkey in steam',
      credit: {
        name: 'Billy Pasco',
        url: 'https://unsplash.com/photos/bjzmWzH0ONA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-18.jpg',
      alt: 'A cute fluffy snow monkey face close-up',
      credit: {
        name: 'Ken Smith',
        url: 'https://unsplash.com/photos/SphO47invCU',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-19.jpg',
      alt: 'A cute marmoset peeking round tree',
      credit: {
        name: 'César Oliveira',
        url: 'https://unsplash.com/photos/RtRw-NIg9aI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-20.jpg',
      alt: 'A cute baby macaque dangling from twig',
      credit: {
        name: 'gemmmm',
        url: 'https://unsplash.com/photos/53ejvTKdgGc',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-21.jpg',
      alt: 'A cute fluffy baby macaque close-up',
      credit: {
        name: 'Martin Jernberg',
        url: 'https://unsplash.com/photos/9ah7Ovj0CDA',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-22.jpg',
      alt: 'A cute wide-eyed baby rhesus portrait',
      credit: {
        name: 'Jerome Sallerin',
        url: 'https://unsplash.com/photos/FfwbJYCuYTY',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-23.jpg',
      alt: 'A cute baby macaque on sunlit wall',
      credit: {
        name: 'Vantha So',
        url: 'https://unsplash.com/photos/GjDUuCtzzAQ',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-26.jpg',
      alt: 'A cute cotton-top tamarin in a tree',
      credit: {
        name: 'Sandy Millar',
        url: 'https://unsplash.com/photos/7OMaXVGZuRI',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-27.jpg',
      alt: 'A cute long-tailed macaque close-up',
      credit: {
        name: 'Des Récits',
        url: 'https://unsplash.com/photos/KD8jKVdCFoQ',
        site: 'Unsplash',
      },
    },
    {
      src: '/rewards/monkey/monkey-29.jpg',
      alt: 'A cute squirrel monkey pair on jungle branch',
      credit: {
        name: 'Tomáš Malík',
        url: 'https://www.pexels.com/photo/two-squirrel-monkeys-25929087/',
        site: 'Pexels',
      },
    },
    {
      src: '/rewards/monkey/monkey-31.jpg',
      alt: 'A cute two squirrel monkeys on sunny rock',
      credit: {
        name: 'Molly Champion',
        url: 'https://www.pexels.com/photo/close-up-of-two-monkeys-9381879/',
        site: 'Pexels',
      },
    },
  ],
};

export function pickReward(critter: Critter): Reward | null {
  const list = REWARDS[critter];
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// Same base handling as the router: BASE_URL ends with "/", reward src starts with "/".
export function rewardSrc(reward: Reward): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${reward.src}`;
}
