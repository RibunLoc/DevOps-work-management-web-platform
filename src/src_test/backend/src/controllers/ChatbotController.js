//import {OpenAI} from "openai";
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
class ChatbotController {

    //[POST]
    async handleUserInput(req, res) {

        // console.log('abc')
        // const { OpenAI } = await import("openai");
        // const openai = new OpenAI({
        //     apiKey: process.env.OPENAI_API_KEY
        // });

        const { input } = req.query
        var generatedText = ""

        const petKeywords = [
            "dog", "puppy", "cat", "kitten", "bird", "parrot", "fish", "rabbit",
            "hamster", "turtle", "snake", "vet", "grooming", "adoption", "shelter",
            "pet food", "kennel", "obedience", "leash", "litter box", "paw", "vet", "continue", "pet",
            "chó", "cún con", "mèo", "mèo con", "chim", "vẹt", "cá", "thỏ",
            "chuột","hamster", "rùa", "rắn", "thú y", "chăm sóc", "nhận nuôi", "trại động vật", "thú cưng", "chuồng", "vâng lời", "dây xích", "hộp cát", "chân thú cưng", "thú y", "tiếp", "tiếp tục", "chúng", "chúng nó"
        ];


        // const petKeywords = [
        //     "clothing", "fashion", "style", "outfit", "wardrobe", "accessories", "shoes", "heels",
        //     "sneakers", "boots", "sandals", "jewelry", "necklace", "bracelet", "ring", "earrings",
        //     "watch", "hat", "cap", "scarf", "gloves", "belt", "handbag", "purse", "backpack", "sunglasses",
        //     "jacket", "coat", "blazer", "suit", "dress", "gown", "skirt", "jeans", "trousers",
        //     "pants", "shorts", "shirt", "blouse", "t-shirt", "top", "tank top", "sweater", "hoodie",
        //     "cardigan", "vest", "lingerie", "swimsuit", "bikini", "fashion show", "runway", "designer",
        //     "couture", "trendy", "chic", "elegant", "casual", "formal", "streetwear", "vintage",
        //     "retro", "luxury", "brand", "pattern", "fabric", "textile", "sewing", "embroidery", "tailoring",
        //     "fashionista", "model", "couturier", "fashion week", "wardrobe essentials", "color palette",
        //     "monochrome", "accessorize", "fit", "oversized", "slim-fit", "athleisure", "boho", "preppy",
        //     "minimalist", "bold", "print", "lace", "leather", "denim", "silk", "cotton", "wool", "satin",
        //     "velvet", "suede", "faux fur", "knitwear", "haute couture", "ready-to-wear", "trend", "iconic",
        //     "sustainable", "eco-friendly", "fast fashion", "personal style", "fashion blog", "capsule wardrobe",
        //     "thrift", "runway looks", "high heels", "fashion influencer", "wardrobe stylist", "tailor-made",
        //     "mix and match",
        //     // Tiếng Việt
        //     "quần áo", "thời trang", "phong cách", "trang phục", "tủ đồ", "phụ kiện", "giày", "giày cao gót",
        //     "giày thể thao", "ủng", "dép", "trang sức", "dây chuyền", "vòng tay", "nhẫn", "bông tai",
        //     "đồng hồ", "mũ", "nón", "khăn choàng", "găng tay", "thắt lưng", "túi xách", "ví", "ba lô", "kính râm",
        //     "áo khoác", "áo choàng", "áo vest", "bộ vest", "váy", "váy dạ hội", "chân váy", "quần jean", "quần âu",
        //     "quần dài", "quần short", "áo sơ mi", "áo kiểu", "áo thun", "áo ba lỗ", "áo len", "áo hoodie",
        //     "áo cardigan", "áo ghi lê", "đồ lót", "đồ bơi", "bikini", "trình diễn thời trang", "sàn diễn", "nhà thiết kế",
        //     "thời trang cao cấp", "thời trang xu hướng", "thanh lịch", "casual", "formal", "thời trang đường phố", "cổ điển",
        //     "retro", "sang trọng", "thương hiệu", "họa tiết", "vải", "chất liệu", "may đo", "thêu", "thiết kế",
        //     "tín đồ thời trang", "người mẫu", "thợ may", "tuần lễ thời trang", "món đồ thiết yếu", "bảng màu",
        //     "đơn sắc", "phụ kiện hóa", "vừa vặn", "oversized", "slim-fit", "thời trang thể thao", "boho", "preppy",
        //     "tối giản", "nổi bật", "họa tiết", "ren", "da", "denim", "lụa", "cotton", "len", "satin",
        //     "nhung", "da lộn", "lông giả", "len đan", "thời trang cao cấp", "hàng may sẵn", "xu hướng", "biểu tượng",
        //     "bền vững", "thân thiện môi trường", "thời trang nhanh", "phong cách cá nhân", "blog thời trang", "tủ đồ capsule",
        //     "mua đồ second-hand", "phong cách runway", "giày cao gót", "người ảnh hưởng thời trang", "stylist", "may đo theo ý",
        //     "phối đồ"
        // ];
        // Function to check if input contains pet-related keywords
        const containsPetKeywords = (input) => {
            const lowerInput = input.toLowerCase();
            return petKeywords.some(keyword => lowerInput.includes(keyword));
        }

        if (!containsPetKeywords(input)) {
            res.status(500).send({
                message: "Please ask something about pet only"
            })
        }

        try {
            // const completion = await openai.chat.completions.create({
            //     model: "gpt-4o-mini",
            //     messages: [
            //         { role: "system", content: "You are a helpful assistant." },
            //         {
            //             role: "user",
            //             content: input,
            //         },
            //     ],
            //     max_tokens: 50
            // });
            // //console.log(newUser)


            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    candidateCount: 1,
                    maxOutputTokens: 700,
                    temperature: 1.0,
                },
            });

            //const prompt = "Write a story about a magic backpack.";

            const result = await model.generateContent(input);

            generatedText = result.response.text().trim();

            if (generatedText.length > 0) {
                // Check if it doesn't end with proper punctuation
                if (!generatedText.endsWith(".") && !generatedText.endsWith("!") && !generatedText.endsWith("?")) {
                    // If the text doesn't end with proper punctuation, add a period at the end
                    generatedText += ".";  // Append a period to complete the sentence
                }

                // Optionally, remove partial or cut-off sentences
                // For instance, if the text ends with certain words that signal incomplete thoughts, remove or adjust
                if (generatedText.endsWith("...")) {
                    generatedText = generatedText.slice(0, -3);  // Remove ellipsis
                    generatedText += ".";  // Add period for completion
                }
            }

            console.log(result.response.text());
            return res.status(200).json({
                message: generatedText
            })
        } catch (e) {
            console.log('Some error in getting response. Try again!!', e)
        }
    }


}

module.exports = new ChatbotController

