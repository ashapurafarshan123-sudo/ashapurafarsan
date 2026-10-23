import os
import io
import re
import zipfile
from PIL import Image

ZIP_PATH = 'img.zip'
OUTPUT_IMG_DIR = os.path.join('public', 'images', 'products')
os.makedirs(OUTPUT_IMG_DIR, exist_ok=True)

# Product catalog definition
CATALOG_DEFS = [
    {
        "zip_file": "bajra puri.png",
        "slug": "bajra-puri",
        "name": "Bajra Puri",
        "category_slug": "maida",
        "description": "Crispy, nutritious pearl millet puris spiced with sesame, carom seeds, and mild hing.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "bhadang bhel.png",
        "slug": "bhadang-bhel",
        "name": "Bhadang Bhel",
        "category_slug": "bhel",
        "description": "Zesty spiced puffed rice bhel tossed with roasted peanuts, curry leaves, and red chili.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "bhajni chakli.png",
        "slug": "bhajni-chakli",
        "name": "Bhajni Chakli",
        "category_slug": "chakli",
        "description": "Authentic multigrain roasted flour chakli hand-pressed with cumin and coriander spice notes.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "bhavnagari gathiya.png",
        "slug": "bhavnagari-gathiya",
        "name": "Bhavnagari Gathiya",
        "category_slug": "namkeen",
        "description": "Melt-in-mouth Gujarati Bhavnagari gathiya with subtle carom seed and black pepper warmth.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "bombay mix farsan.png",
        "slug": "bombay-mix-farsan",
        "name": "Bombay Mix Farsan",
        "category_slug": "namkeen",
        "description": "The quintessential Mumbai tea-time farsan with crunchy sev, boondi, flakes, and nuts.",
        "bestseller": True,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "butter-chakli.png",
        "slug": "butter-chakli",
        "name": "Butter Chakli",
        "category_slug": "chakli",
        "description": "Delicate spiral rice flour chaklis infused with pure butter for a melt-in-mouth crunch.",
        "bestseller": True,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "Chana-Dal.png",
        "slug": "chana-dal",
        "name": "Chana Dal Namkeen",
        "category_slug": "chana-singh",
        "description": "Golden fried split Bengal gram seasoned with rock salt, amchur, and roasted spices.",
        "bestseller": False,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "chanajhor.png",
        "slug": "chanajhor",
        "name": "Chana Jor Garam",
        "category_slug": "namkeen",
        "description": "Pressed and spiced black chickpeas roasted to perfection with tangy chaat masala.",
        "bestseller": False,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "Cheese-Balls.png",
        "slug": "cheese-balls",
        "name": "Cheese Balls",
        "category_slug": "nali",
        "description": "Airy, crunchy puffed corn balls generously dusted with savory cheddar cheese seasoning.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "corn-khatta-mitha-chivda.png",
        "slug": "corn-khatta-mitha-chivda",
        "name": "Corn Khatta Meetha Chivda",
        "category_slug": "poha-chivda",
        "description": "Crunchy golden cornflakes tossed in sweet-and-sour spices with raisins and peanuts.",
        "bestseller": True,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "dabeli sing.png",
        "slug": "dabeli-sing",
        "name": "Dabeli Sing",
        "category_slug": "chana-singh",
        "description": "Signature roasted Bharuch peanuts coated in aromatic sweet and spicy Kutchhi Dabeli masala.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "dal moth.png",
        "slug": "dal-moth",
        "name": "Dal Moth",
        "category_slug": "namkeen",
        "description": "Crispy fried whole brown lentils blended with fine gram sev, cashews, and rich spices.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "diet bhel.png",
        "slug": "diet-bhel",
        "name": "Diet Bhel",
        "category_slug": "bhel",
        "description": "Zero-guilt roasted puffed rice tossed with turmeric, mustard seeds, and light rock salt.",
        "bestseller": False,
        "prices": {"250g": 85, "500g": 160, "1kg": 300}
    },
    {
        "zip_file": "diet-chivda.png",
        "slug": "diet-chivda",
        "name": "Diet Chivda",
        "category_slug": "diet-chivda",
        "description": "Wholesome roasted poha mix with minimal oil, seasoned with green chili and roasted curry leaves.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "farali chivda.png",
        "slug": "farali-chivda",
        "name": "Farali Chivda (Fasting Special)",
        "category_slug": "poha-chivda",
        "description": "Traditional Upvas chivda made with crispy sago pearls, potato salli, roasted peanuts, and sendha namak.",
        "bestseller": False,
        "prices": {"250g": 115, "500g": 220, "1kg": 420}
    },
    {
        "zip_file": "golden mix chivda.png",
        "slug": "golden-mix-chivda",
        "name": "Golden Mix Chivda",
        "category_slug": "poha-chivda",
        "description": "Crispy beaten rice, puffed cereals, and roasted nuts tossed in a golden aromatic glaze.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "Kachori.png",
        "slug": "kachori",
        "name": "Ashapura Spcl Kachori",
        "category_slug": "maida",
        "description": "Flaky, golden-fried artisanal kachoris filled with spiced crushed moong dal, roasted hing, and black pepper.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "kerela chips.png",
        "slug": "kerela-chips",
        "name": "Kerala Banana Chips",
        "category_slug": "wafers",
        "description": "Sun-ripened Nendran raw bananas sliced and crisp-fried in pure coconut oil with sea salt.",
        "bestseller": True,
        "prices": {"250g": 120, "500g": 230, "1kg": 440}
    },
    {
        "zip_file": "khatta-mitha-chivda.png",
        "slug": "khatta-mitha-chivda",
        "name": "Khatta Meetha Chivda",
        "category_slug": "poha-chivda",
        "description": "A sweet, tangy harmony of crispy poha, savory sev, golden raisins, and roasted peanuts.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "lasun chivda.png",
        "slug": "lasun-chivda",
        "name": "Lasun Chivda",
        "category_slug": "poha-chivda",
        "description": "Bold and fragrant roasted garlic flakes tossed with crispy poha and fiery red chili.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "lemon bhel.png",
        "slug": "lemon-bhel",
        "name": "Lemon Bhel",
        "category_slug": "bhel",
        "description": "Crispy puffed rice infused with zesty natural lemon essence and crushed green chilies.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "long banana spicy chips.png",
        "slug": "long-banana-spicy-chips",
        "name": "Long Banana Spicy Chips",
        "category_slug": "wafers",
        "description": "Ribbon-cut raw banana strips seasoned with hot Kashmiri red chili and cumin seasoning.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "makai-mung-stick.png",
        "slug": "makai-mung-stick",
        "name": "Makai Moong Stick",
        "category_slug": "diet-chivda",
        "description": "Crunchy roasted corn and sprouted moong flour sticks packed with fiber and savory flavor.",
        "bestseller": False,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "makhaniya gathiya.png",
        "slug": "makhaniya-gathiya",
        "name": "Makhaniya Gathiya",
        "category_slug": "namkeen",
        "description": "Soft, pillowy gram flour gathiya that melts effortlessly in your mouth, lightly salted.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "mangluri chivda.png",
        "slug": "mangluri-chivda",
        "name": "Mangalori Chivda",
        "category_slug": "poha-chivda",
        "description": "Coastal-style poha chivda tempered with fresh curry leaves, mustard seeds, and fried coconut slices.",
        "bestseller": False,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "masala-nali.png",
        "slug": "masala-nali",
        "name": "Masala Nali",
        "category_slug": "nali",
        "description": "Hollow cylinder fryums dusted generously with tangy peri-peri and Indian chaat spices.",
        "bestseller": False,
        "prices": {"250g": 85, "500g": 160, "1kg": 300}
    },
    {
        "zip_file": "masala-patla-chips.png",
        "slug": "masala-patla-chips",
        "name": "Masala Patla Potato Chips",
        "category_slug": "wafers",
        "description": "Ultra-thin sliced golden potatoes seasoned with our secret blend of Gujarati masala spices.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "methi gathiya.png",
        "slug": "methi-gathiya",
        "name": "Methi Gathiya",
        "category_slug": "namkeen",
        "description": "Traditional thick chickpea flour noodles flavored with aromatic dried fenugreek leaves (kasuri methi).",
        "bestseller": False,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "methi muthiya.png",
        "slug": "methi-muthiya",
        "name": "Methi Muthiya",
        "category_slug": "maida",
        "description": "Crispy fried bite-sized dumplings made with fresh fenugreek leaves, gram flour, and sesame.",
        "bestseller": False,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "methi puri.png",
        "slug": "methi-puri",
        "name": "Methi Puri",
        "category_slug": "maida",
        "description": "Flaky, layered savory mathris enriched with fragrant fenugreek, ajwain, and pure ghee.",
        "bestseller": True,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "Mini-Bhakarwadi.png",
        "slug": "mini-bhakarwadi",
        "name": "Mini Bhakarwadi",
        "category_slug": "maida",
        "description": "Crispy spiral roll bites stuffed with a fiery coconut, sesame, and sweet-spicy spice mix.",
        "bestseller": True,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "miri gathiya.png",
        "slug": "miri-gathiya",
        "name": "Miri Gathiya",
        "category_slug": "namkeen",
        "description": "Savory gram flour gathiya generously seasoned with freshly crushed Malabar black pepper.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "miri-yellow-chips.png",
        "slug": "miri-yellow-chips",
        "name": "Miri Yellow Banana Chips",
        "category_slug": "wafers",
        "description": "Crisp yellow banana rounds coated with freshly crushed black peppercorns and pink rock salt.",
        "bestseller": False,
        "prices": {"250g": 115, "500g": 220, "1kg": 420}
    },
    {
        "zip_file": "mix farsan.png",
        "slug": "mix-farsan",
        "name": "Gujarati Mix Farsan",
        "category_slug": "namkeen",
        "description": "The quintessential snack mix with sev, gathiya, boondi, and fried pulses for everyday enjoyment.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "mix multigran poha chivda.png",
        "slug": "mix-multigran-poha-chivda",
        "name": "Mix Multigrain Poha Chivda",
        "category_slug": "poha-chivda",
        "description": "Wholesome roasted poha blended with sorghum, ragi, and corn puffs for healthy guilt-free munching.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "mora sev.png",
        "slug": "mora-sev",
        "name": "Mora Sev (Zero Salt)",
        "category_slug": "namkeen",
        "description": "Crispy gram flour vermicelli prepared completely without salt, ideal for diet restrictions & bhel.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "multigran chivda.png",
        "slug": "multigran-chivda",
        "name": "Multigrain Chivda",
        "category_slug": "diet-chivda",
        "description": "A crunchy blend of roasted whole pulses, oats, and grains lightly spiced with green chili.",
        "bestseller": True,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "mumbai-bhel.png",
        "slug": "mumbai-bhel",
        "name": "Mumbai Sukha Bhel",
        "category_slug": "bhel",
        "description": "Authentic Chowpatty-style dry bhel mix with crisp murmura, sev, papdi, and tangy spices.",
        "bestseller": True,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "Mung-Dal.png",
        "slug": "mung-dal",
        "name": "Crispy Moong Dal",
        "category_slug": "chana-singh",
        "description": "Delicately fried yellow moong lentils lightly sprinkled with sea salt for a protein-rich snack.",
        "bestseller": False,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "muruku chakli.png",
        "slug": "muruku-chakli",
        "name": "Murukku Chakli",
        "category_slug": "chakli",
        "description": "South-Indian inspired rice and urad dal spiral murukku with fragrant cumin and asafoetida.",
        "bestseller": False,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "nachni chips.png",
        "slug": "nachni-chips",
        "name": "Nachni Chips",
        "category_slug": "diet-chivda",
        "description": "Crisp, calcium-rich finger millet (ragi) chips lightly seasoned with chatpata masala.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "nachni rosted chivda.png",
        "slug": "nachni-rosted-chivda",
        "name": "Roasted Nachni Chivda",
        "category_slug": "diet-chivda",
        "description": "Oil-free roasted ragi flakes tossed with crunchy peanuts, dry coconut, and mustard tempering.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "nadiyadi bhusa.png",
        "slug": "nadiyadi-bhusa",
        "name": "Nadiyadi Bhusa",
        "category_slug": "namkeen",
        "description": "The pride of Nadiyad — sweet, spicy, and tangy mixture with crunchy sev, nuts, and lentils.",
        "bestseller": True,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "nailon sev.png",
        "slug": "nailon-sev",
        "name": "Nylon Sev",
        "category_slug": "namkeen",
        "description": "Extra-fine, golden chickpea vermicelli — the indispensable topping for sev puri, dahi puri & chaat.",
        "bestseller": True,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "naylon bhavnagri gathiya.png",
        "slug": "naylon-bhavnagri-gathiya",
        "name": "Nylon Bhavnagri Gathiya",
        "category_slug": "namkeen",
        "description": "Feather-light, soft Bhavnagari gathiya strands crafted with pure groundnut oil and carom seeds.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "palak pudina stick.png",
        "slug": "palak-pudina-stick",
        "name": "Palak Pudina Stick",
        "category_slug": "nali",
        "description": "Crispy extruded snack sticks packed with real spinach and garden mint herbal freshness.",
        "bestseller": False,
        "prices": {"250g": 85, "500g": 160, "1kg": 300}
    },
    {
        "zip_file": "Peanut-Chikki.png",
        "slug": "peanut-chikki",
        "name": "Peanut Chikki",
        "category_slug": "chikki",
        "description": "Crunchy brittle made with golden roasted Bharuch peanuts and organic clarified jaggery.",
        "bestseller": True,
        "prices": {"250g": 120, "500g": 230, "1kg": 440}
    },
    {
        "zip_file": "Poha-Chivda.png",
        "slug": "poha-chivda",
        "name": "Gujarati Poha Chivda",
        "category_slug": "poha-chivda",
        "description": "Light, paper-thin beaten rice roasted to crisp perfection with turmeric, peanuts, and green chili.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "Potato-Waffers.png",
        "slug": "potato-waffers",
        "name": "Classic Salted Potato Wafers",
        "category_slug": "wafers",
        "description": "Paper-thin, golden potato chips fried to a delicate shatter-crunch and seasoned with sea salt.",
        "bestseller": True,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "ratlami sev.png",
        "slug": "ratlami-sev",
        "name": "Ratlami Sev",
        "category_slug": "namkeen",
        "description": "Signature spicy sev flavored with bold clove, black pepper, and hing, hailing from the Malwa heartland.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "Roasted-Multigran-Chivda.png",
        "slug": "roasted-multigran-chivda",
        "name": "Roasted Multigrain Chivda",
        "category_slug": "diet-chivda",
        "description": "Low-calorie roasted mixture of wheat flakes, bajra puffs, and golden moong.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "Roasted-Nachni-Chips.png",
        "slug": "roasted-nachni-chips",
        "name": "Roasted Nachni Chips",
        "category_slug": "diet-chivda",
        "description": "Oven-roasted ragi wafers with a zesty sprinkle of chaat masala and dry mango powder.",
        "bestseller": False,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "sada bundi.png",
        "slug": "sada-bundi",
        "name": "Sada Boondi",
        "category_slug": "namkeen",
        "description": "Golden round droplets of gram flour, lightly salted and perfect for raita, jaljeera, or snacking.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "sada-nali.png",
        "slug": "sada-nali",
        "name": "Sada Nali",
        "category_slug": "nali",
        "description": "Crispy hollow tube fryums delicately salted — a beloved tea-time nostalgia snack for kids & adults.",
        "bestseller": False,
        "prices": {"250g": 80, "500g": 150, "1kg": 290}
    },
    {
        "zip_file": "sada-vati.png",
        "slug": "sada-vati",
        "name": "Sada Vati",
        "category_slug": "nali",
        "description": "Crisp cup-shaped salted fryums with light crunch and delicate flavor.",
        "bestseller": False,
        "prices": {"250g": 80, "500g": 150, "1kg": 290}
    },
    {
        "zip_file": "salted-patla-chips.png",
        "slug": "salted-patla-chips",
        "name": "Salted Patla Potato Chips",
        "category_slug": "wafers",
        "description": "Feather-light sliced potato chips sprinkled with mineral rock salt.",
        "bestseller": False,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "Salted-Pinuts.png",
        "slug": "salted-pinuts",
        "name": "Salted Peanuts",
        "category_slug": "chana-singh",
        "description": "Traditional roasted Bharuch peanuts lightly dusted with fine salt.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "salted-yellow-chana.png",
        "slug": "salted-yellow-chana",
        "name": "Salted Yellow Chana",
        "category_slug": "chana-singh",
        "description": "Crispy sand-roasted yellow split Bengal gram with delicate natural salt seasoning.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "sev puri.png",
        "slug": "sev-puri",
        "name": "Sev Puri Flat Papdi",
        "category_slug": "maida",
        "description": "Crispy, flaky wheat flour flat papdis specially baked for Mumbai sev puri & chaat platters.",
        "bestseller": True,
        "prices": {"250g": 85, "500g": 160, "1kg": 300}
    },
    {
        "zip_file": "Sezwan-Chakali.png",
        "slug": "sezwan-chakali",
        "name": "Schezwan Chakli",
        "category_slug": "chakli",
        "description": "Spicy fusion chakli spiked with bold garlic, ginger, and spicy Schezwan chili paste.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "shakkar-para.png",
        "slug": "shakkar-para",
        "name": "Shakkar Para",
        "category_slug": "maida",
        "description": "Sweet, flaky diamond-shaped bites glazed in delicate cardamom sugar syrup.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "sing-bhujiya.png",
        "slug": "sing-bhujiya",
        "name": "Sing Bhujia",
        "category_slug": "chana-singh",
        "description": "Crunchy roasted peanuts enrobed in a spiced, golden chickpea flour crust.",
        "bestseller": True,
        "prices": {"250g": 100, "500g": 190, "1kg": 360}
    },
    {
        "zip_file": "softy chakali.png",
        "slug": "softy-chakali",
        "name": "Softy Chakli",
        "category_slug": "chakli",
        "description": "Ultra-tender, soft-textured spiral chakli made with freshly milled rice and cream.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "sweet kerela chips.png",
        "slug": "sweet-kerela-chips",
        "name": "Sweet Kerala Banana Chips",
        "category_slug": "wafers",
        "description": "Traditional Sharkara Varatti — thick banana chunks coated in caramelized jaggery, dried ginger, and cumin.",
        "bestseller": False,
        "prices": {"250g": 125, "500g": 240, "1kg": 460}
    },
    {
        "zip_file": "tikha bundi.png",
        "slug": "tikha-bundi",
        "name": "Tikha Boondi",
        "category_slug": "namkeen",
        "description": "Spicy, savory chickpea flour pearls tossed with red chili, roasted hing, and curry leaves.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "tikha gathiya.png",
        "slug": "tikha-gathiya",
        "name": "Tikha Gathiya",
        "category_slug": "namkeen",
        "description": "Fiery Gujarati gathiya loaded with crushed red chilies, black pepper, and carom seeds.",
        "bestseller": True,
        "prices": {"250g": 95, "500g": 180, "1kg": 340}
    },
    {
        "zip_file": "tikha sev.png",
        "slug": "tikha-sev",
        "name": "Tikha Sev",
        "category_slug": "namkeen",
        "description": "Zesty spicy gram flour noodles with a kick of hot chili powder and asafoetida.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    },
    {
        "zip_file": "til katri.png",
        "slug": "til-katri",
        "name": "Til Katri",
        "category_slug": "chikki",
        "description": "Delicate, nutty sesame seed diamonds bound with pure jaggery and green cardamom.",
        "bestseller": False,
        "prices": {"250g": 125, "500g": 240, "1kg": 460}
    },
    {
        "zip_file": "tomato chakli.png",
        "slug": "tomato-chakli",
        "name": "Tomato Chakli",
        "category_slug": "chakli",
        "description": "Crunchy spiral chakli infused with real tangy tomato puree and savory spice notes.",
        "bestseller": False,
        "prices": {"250g": 105, "500g": 200, "1kg": 380}
    },
    {
        "zip_file": "tomato-banana-chips.png",
        "slug": "tomato-banana-chips",
        "name": "Tomato Banana Chips",
        "category_slug": "wafers",
        "description": "Crisp raw banana wafers dusted in sweet and tangy Spanish tomato seasoning.",
        "bestseller": False,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "yellow banana chips.png",
        "slug": "yellow-banana-chips",
        "name": "Yellow Banana Chips",
        "category_slug": "wafers",
        "description": "Authentic thin-cut raw banana rounds lightly seasoned with turmeric and sea salt.",
        "bestseller": True,
        "prices": {"250g": 110, "500g": 210, "1kg": 400}
    },
    {
        "zip_file": "yellow-chana.png",
        "slug": "yellow-chana",
        "name": "Roasted Yellow Chana",
        "category_slug": "chana-singh",
        "description": "Crunchy, sand-roasted split Bengal gram — high protein, natural fiber, and irresistible crunch.",
        "bestseller": False,
        "prices": {"250g": 90, "500g": 170, "1kg": 320}
    }
]

def crop_and_square(img, target_size=600, padding_ratio=0.06):
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    content_size = int(target_size * (1 - 2 * padding_ratio))
    w, h = img.size
    scale = min(content_size / w, content_size / h)
    new_w, new_h = max(1, int(w * scale)), max(1, int(h * scale))
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    square = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    offset = ((target_size - new_w) // 2, (target_size - new_h) // 2)
    square.paste(resized, offset, resized)
    return square

if __name__ == '__main__':
    print(f"Processing {len(CATALOG_DEFS)} products from {ZIP_PATH}...")
    processed = 0

    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        for item in CATALOG_DEFS:
            zip_file_path = f"img/{item['zip_file']}"
            try:
                data = z.read(zip_file_path)
                raw_img = Image.open(io.BytesIO(data))
                sq_img = crop_and_square(raw_img)
                
                out_file = f"{item['slug']}.webp"
                out_path = os.path.join(OUTPUT_IMG_DIR, out_file)
                sq_img.save(out_path, format='WEBP', quality=85, method=6)
                
                item['image'] = f"/images/products/{out_file}"
                processed += 1
                if processed % 10 == 0 or processed == len(CATALOG_DEFS):
                    print(f" -> Processed {processed}/{len(CATALOG_DEFS)} images: {out_file}")
            except Exception as e:
                print(f" Error processing {zip_file_path}: {e}")

    print(f"\nAll {processed} images optimized and saved in {OUTPUT_IMG_DIR}!")

    # Generate SQL seed file for Supabase
    sql_path = os.path.join('supabase', 'seed_all_72_products.sql')
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write("-- ==============================================================================\n")
        f.write("-- ASHAPURA FARSAN — 72 REAL PRODUCTS & VARIANTS SEED MIGRATION\n")
        f.write("-- Generated from client image catalog with 600x600 transparent WebP assets\n")
        f.write("-- ==============================================================================\n\n")
        
        f.write("BEGIN;\n\n")
        
        # 1. Upsert Products
        f.write("-- 1. UPSERT ALL PRODUCTS\n")
        for p in CATALOG_DEFS:
            prod_id = f"{p['category_slug']}-{p['slug']}"
            desc = p['description'].replace("'", "''")
            name = p['name'].replace("'", "''")
            bestseller = "TRUE" if p['bestseller'] else "FALSE"
            
            f.write(f"INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)\n")
            f.write(f"VALUES ('{prod_id}', '{p['slug']}', '{name}', '{p['category_slug']}', '{desc}', '{p['image']}', {bestseller}, TRUE)\n")
            f.write(f"ON CONFLICT (id) DO UPDATE SET\n")
            f.write(f"    name = EXCLUDED.name,\n")
            f.write(f"    slug = EXCLUDED.slug,\n")
            f.write(f"    category_slug = EXCLUDED.category_slug,\n")
            f.write(f"    description = EXCLUDED.description,\n")
            f.write(f"    image = EXCLUDED.image,\n")
            f.write(f"    bestseller = EXCLUDED.bestseller,\n")
            f.write(f"    is_active = TRUE,\n")
            f.write(f"    updated_at = NOW();\n\n")
            
        # 2. Upsert Product Variants (250g, 500g, 1kg)
        f.write("\n-- 2. UPSERT ALL PRODUCT PACKAGING VARIANTS (250g, 500g, 1kg)\n")
        for p in CATALOG_DEFS:
            prod_id = f"{p['category_slug']}-{p['slug']}"
            for size, price in p['prices'].items():
                f.write(f"INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)\n")
                f.write(f"VALUES ('{prod_id}', '{size}', {price:.2f}, 100, TRUE)\n")
                f.write(f"ON CONFLICT (product_id, size_label) DO UPDATE SET\n")
                f.write(f"    price = EXCLUDED.price,\n")
                f.write(f"    stock_quantity = EXCLUDED.stock_quantity,\n")
                f.write(f"    is_active = TRUE;\n")
                
        f.write("\nCOMMIT;\n")

    print(f"SQL seed script written to {sql_path} ({os.path.getsize(sql_path)} bytes)")
