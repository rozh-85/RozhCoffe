
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'lokmada',
    name: 'Lokmada',
    itemCount: 15,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYbU2mcKBAv5XkQkeErE9wEEsx1zi8_tAsbLX8lmAhjcPpRG5iyCP5oEPEDe4zqsYONDFOn7zlNg54uUZQfXkXAXnNeZkJ81Ys4t4k6EFHED7XhkSE81agndlYcuDzmA2tHsGmwUGHW94SpCtZtdha5bl-cNHHblIy8amXJgHw4OHWglq4fhqiSZOXiPBznG5P0auc6cwS9w4wDHQRLs9-DnzpCqwlHeDcIo8zo22anGRkImT5vuIRqb7iPYHhutzmyHRTeHeEemTl'
  },
  {
    id: 'bakehouse',
    name: 'Bake House',
    itemCount: 12,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAeyLQ9h8RNJH9caitxUvy7bWy5vDskwJuoYqbi52UPMPAFRbCp1ysgKEDeaq_02jitGICAqpQqMhgnLg_M9baFeeGEWqGu29b0IGdydoUH3qKGvQyAkt_qUaW2kuqOoo0FdWycqJccBYC5Kq-es_8v62nX89U6ViOJXjuOEwdD8Qp461OxkicMKVo0zgkoR2yinJ-Ha6DDNHPmbyld9jZ0Py9P_gjkFHKn99V1njUQW-s3DQ0ipAFXkoAmrCMsaTzmll6eiCxrbg4'
  },
  {
    id: 'crepes',
    name: 'Crepes & Waffles',
    itemCount: 8,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: 'drinks',
    name: 'Cold Drinks',
    itemCount: 10,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: 'coffee',
    name: 'Coffee',
    itemCount: 6,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'white-lokmada',
    name: 'White Lokmada',
    description: 'Vanilla - White Chocolate - Oreo',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNTU_5GqNP7Y70lWdBFYZJoAa1gJKX0B4g8nAjKaaqlEdI9uMToMj7Oy5NyxrQtFcHXXdYeq4mgxtRO2y2RiDb8yEMFxQQPiCiR3VhMK2DVqcK34GBRPTgMAonVp6pTrra4_1Z2XsX4bjPWDx1y8M84wkkRr0BUIHOsQXmDhltlqlY2KWCLi6wCiRtG3r0FGD5-jAw02ybSIHXfTScicKR5djlNC4yFNiYvZUXulkd2RJamO9cqpvSv2DWTp_EE5HIfKv1S85R_g1v',
    category_id: 'lokmada',
    is_available: true,
    isMultiPriced: true,
    prices: [
      { size: 'Small', price_value: 'IQD 2,500' },
      { size: 'Medium', price_value: 'IQD 5,000' },
      { size: 'Large', price_value: 'IQD 9,000' }
    ]
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional Lokmada balls with sweet honey syrup and cinnamon.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8YjsnSCNFl1MeJl6HhChIztpCFe1TYWZ0jht1hNgk3JW4eDBejrLVL9umaBvTlWeGCetGSfaBf47sSSCNjsTuHD5sWWxZf8jsZ0EwwIps0hKLsOqp3gshXehOepeNGnpT1eNPaDdx0NCPB6InXG5bGKQvH4RJFIk4CNTr7uEthDEfLeiZ-P_G3tkPRYt5TpFrY_gsG01P8HUfncggM0QDeGf7UNqLQmTvus7GnMKWWQbbXYsXXb2JatJBrVM82YhCqmZ4O0NQrCC3',
    category_id: 'lokmada',
    is_available: true,
    isMultiPriced: true,
    prices: [
      { size: 'Small', price_value: 'IQD 2,500' },
      { size: 'Medium', price_value: 'IQD 5,000' },
      { size: 'Large', price_value: 'IQD 9,000' }
    ]
  },
  {
    id: 'lotus',
    name: 'Lotus',
    description: 'Rich caramel and Lotus Biscoff biscuit crumble topping.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCev3N8dzNyEgGRmU_2sGBREdHwLuUr60KmF8gyp_C-BpnhRiAs-s_7Cg_aUKdUZbp2MDdvLyiC3l5dyIkxCUjg0SFeebwbYSm6QDLv_nQEi-APEdR2Vc6aDd36_T8WQgXPKsYUTnn4yIqpAMSCTufIhKA3T0GTp6APrp-bWInjhq1L8BE0M9APsI0o90mbffpPXGTgG_47cJqqPAlCowdorG70AHZpDBbnlTEAbY0RyRFrWQqzlX8qOzuvsfMbP9PIHWTllamGUsgV',
    category_id: 'lokmada',
    is_available: true,
    isMultiPriced: true,
    prices: [
      { size: 'Small', price_value: 'IQD 4,000' },
      { size: 'Medium', price_value: 'IQD 8,000' },
      { size: 'Large', price_value: 'IQD 13,000' }
    ]
  },
  {
    id: 'pistachio-dream',
    name: 'Pistachio Dream',
    description: 'Velvety pistachio cream with chopped Turkish pistachios.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAInQqBgC8r40_VyH48ykIxAQxFIvw0wEGwfmuKyBJOSosaufDbEQA-JMny2RDOn769I_7xleWbcnX6l3kMey9ImvyN1Wy0p8mEt_bPk5cjcY5xKSG8NQ4OYr9aHukYTL-Y-o-56GgTioiXLUoeDsF2F05vug67GoWIHN5z39P1D-beaE26r3XXkfTHGGFo8MpM4z9yzEJU6hDpyEVbBygEDGwGAdvh9UxqW4LmH8cn53KJ26VZoTIsBrCiAP_PwPlNX-pilXXW_Fd',
    category_id: 'lokmada',
    is_available: true,
    isMultiPriced: true,
    prices: [
      { size: 'Small', price_value: 'IQD 4,500' },
      { size: 'Medium', price_value: 'IQD 9,000' },
      { size: 'Large', price_value: 'IQD 15,000' }
    ]
  },
  {
    id: 'croissant-classic',
    name: 'Classic Croissant',
    description: 'Buttery, flaky, and golden-brown French pastry.',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800&h=600',
    category_id: 'bakehouse',
    is_available: true,
    isMultiPriced: false,
    prices: [
      { size: 'Standard', price_value: 'IQD 3,000' }
    ]
  },
  {
    id: 'belgian-waffle',
    name: 'Belgian Waffle',
    description: 'Warm Belgian waffle with chocolate drizzle and strawberries.',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800&h=600',
    category_id: 'crepes',
    is_available: true,
    isMultiPriced: false,
    prices: [
      { size: 'Standard', price_value: 'IQD 6,000' }
    ]
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    description: 'Refreshing espresso with cold milk and ice.',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800&h=600',
    category_id: 'coffee',
    is_available: true,
    isMultiPriced: false,
    prices: [
      { size: 'Standard', price_value: 'IQD 4,000' }
    ]
  },
  {
    id: 'strawberry-mojito',
    name: 'Strawberry Mojito',
    description: 'Fresh strawberries, mint, and soda.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800&h=600',
    category_id: 'drinks',
    is_available: true,
    isMultiPriced: false,
    prices: [
      { size: 'Standard', price_value: 'IQD 5,000' }
    ]
  }
];