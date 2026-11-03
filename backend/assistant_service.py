"""
SmartCrop AI - Conversational Agricultural Assistant
Answers farmer queries regarding crop cultivation, pest remedies,
fertilizer management, weather protection, irrigation schedules, and government schemes.
"""

# Agricultural Knowledge Base topics
AGRI_KNOWLEDGE = {
    "yellow_leaves": {
        "title": "Chlorosis / Yellow Leaves Diagnosis",
        "answer": (
            "Yellowing leaves (chlorosis) usually stems from one of four primary causes:\n\n"
            "1. **Nitrogen Deficiency**: Older bottom leaves turn uniformly pale yellow first. Remedy: Top-dress with Urea or apply 1% foliar spray of dissolved urea.\n"
            "2. **Iron / Micronutrient Deficiency**: Younger new leaves turn yellow while veins remain bright green (interveinal chlorosis). Remedy: Foliar spray of Ferrous Sulphate (0.5%) + Citric acid (0.1%).\n"
            "3. **Overwatering / Waterlogging**: Roots suffocate from lack of oxygen. Remedy: Improve drainage ditches and withhold irrigation until topsoil dries 2-3 inches.\n"
            "4. **Root Rot / Nematodes**: Yellowing accompanied by wilting during sunny hours. Remedy: Drench with Trichoderma viride or biological bio-nematicide."
        )
    },
    "fertilizer_cost": {
        "title": "Strategies to Reduce Fertilizer Expense by 25-35%",
        "answer": (
            "You can significantly lower your chemical fertilizer expenditures using Integrated Nutrient Management (INM):\n\n"
            "1. **Soil Test-Targeted Dosing**: Never broadcast standard generic bags. Test soil and apply only the calculated deficit.\n"
            "2. **Seed Inoculation with Biofertilizers**: Coat seeds with *Rhizobium* (for pulses) or *Azotobacter* / *Azospirillum* (for cereals). This fixes 20-30 kg atmospheric N/ha for just $2/acre.\n"
            "3. **Phosphate Solubilizing Fungi (PSB)**: Unlocks fixed phosphorus locked in Indian clay soils, reducing DAP requirements by 25%.\n"
            "4. **Neem-Coated Urea with Split Application**: Applying urea in 3 equal splits (Basal, Tillering, Flowering) prevents 40% volatilization and leaching losses.\n"
            "5. **Green Manuring (Dhaincha / Sunnhemp)**: Ploughing 45-day-old green manure adds ~60 kg natural nitrogen and improves moisture retention."
        )
    },
    "companion_crops": {
        "title": "Optimal Companion & Intercropping Combinations",
        "answer": (
            "Intercropping optimizes land use and suppresses weed & pest outbreaks:\n\n"
            "- **Maize + Pigeonpea / Cowpea**: Maize provides support while legumes fix nitrogen and cover soil to retain moisture.\n"
            "- **Cotton + Green Gram / Soybean**: Reduces bollworm infestation and provides short-term cash flow before cotton picking.\n"
            "- **Tomato + Marigold (African)**: Marigold roots secrete alpha-terthienyl which strongly repels root-knot nematodes and attracts predatory hoverflies.\n"
            "- **Sugarcane + Potato / Mustard**: Efficiently utilizes the initial 90-day slow canopy establishment of sugarcane.\n"
            "- **Banana + Ginger / Turmeric**: Partial shade of banana orchard provides the ideal micro-climate for high-value ginger rhizomes."
        )
    },
    "pest_control_organic": {
        "title": "Organic & Biological Pest Management (IPM)",
        "answer": (
            "For eco-friendly pest control without toxic chemical residues:\n\n"
            "1. **Neem Oil (Azadirachtin 10,000 ppm)**: Spray 3-5 mL/L with mild surfactant. Dissects insect feeding, moulting, and egg-laying for sucking pests (aphids, thrips, whiteflies).\n"
            "2. **Yellow & Blue Sticky Traps**: Install 10-15 yellow traps/acre for whiteflies and aphids; blue traps for thrips.\n"
            "3. **Pheromone Traps**: Install 4-5 funnel traps/acre for Fall Armyworm (in maize) or Pink Bollworm (in cotton) for early detection.\n"
            "4. **Dashparni Ark / Agniastra**: Traditional fermented herbal concoction (neem, tobacco, garlic, chili) effective against chewing caterpillars.\n"
            "5. **Beauveria bassiana**: Entomopathogenic fungus foliar spray @ 5 g/L during humid evening hours."
        )
    },
    "government_schemes": {
        "title": "Key Agricultural Support Schemes & Subsidies",
        "answer": (
            "Key farmer welfare initiatives:\n\n"
            "1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**: Income support of ₹6,000 per year in 3 equal installments directly to bank accounts.\n"
            "2. **PM Fasal Bima Yojana (PMFBY)**: Crop insurance protecting against natural calamity losses with subsidized premiums (2% for Kharif, 1.5% for Rabi, 5% for horticultural crops).\n"
            "3. **PM-KUSUM Scheme**: Up to 60% subsidy for setting up standalone solar agriculture water pumps.\n"
            "4. **Soil Health Card Scheme**: Free periodic soil testing across 12 nutrient parameters with personalized crop fertilizer guidelines.\n"
            "5. **Sub-Mission on Agricultural Mechanization (SMAM)**: 40-50% subsidy on rotavators, laser levellers, and seed drills."
        )
    }
}

def get_assistant_response(user_query: str, current_crop: str = "Rice", location: str = "Punjab"):
    """
    Evaluates agricultural query and generates detailed, structured advice.
    """
    q = user_query.lower()

    if any(k in q for k in ["yellow", "pale", "chlorosis", "color"]):
        match = AGRI_KNOWLEDGE["yellow_leaves"]
    elif any(k in q for k in ["cost", "expensive", "save money", "fertilizer price", "reduce fertilizer"]):
        match = AGRI_KNOWLEDGE["fertilizer_cost"]
    elif any(k in q for k in ["companion", "intercrop", "rotation", "mix crop"]):
        match = AGRI_KNOWLEDGE["companion_crops"]
    elif any(k in q for k in ["pest", "insect", "worm", "organic pest", "neem", "spray"]):
        match = AGRI_KNOWLEDGE["pest_control_organic"]
    elif any(k in q for k in ["scheme", "subsidy", "pm kisan", "insurance", "loan", "government"]):
        match = AGRI_KNOWLEDGE["government_schemes"]
    else:
        # Contextual response for general farming questions
        return {
            "title": f"Agronomic Guidance for {current_crop} in {location}",
            "reply": (
                f"Thank you for your question regarding **{current_crop}** cultivation in **{location}**.\n\n"
                f"- **Soil & Moisture Check**: Ensure soil moisture is kept within 45-65% field capacity during current growth stages.\n"
                f"- **Balanced Nutrition**: Follow a 4:2:1 NPK ratio and inspect the SmartCrop Fertilizer Advisor to avoid excess urea.\n"
                f"- **Weather Precautions**: Always inspect wind speed (<15 km/h) and rainfall probabilities before foliar treatments.\n"
                f"- **Scouting Routine**: Scout leaf undersides weekly for early signs of fungal sporulation or pest clusters.\n\n"
                "You can also ask about yellow leaf remedies, companion planting, lowering fertilizer costs, or organic pest solutions!"
            ),
            "suggested_chips": [
                "How to treat yellow leaves?",
                "How to reduce fertilizer cost?",
                "Best companion crops?",
                "Organic pest control tips"
            ]
        }

    return {
        "title": match["title"],
        "reply": match["answer"],
        "suggested_chips": [
            "What fertilizers should I apply next?",
            "How to prepare neem foliar spray?",
            "Subsidy schemes for solar pumps",
            "Optimal watering for my farm"
        ]
    }
