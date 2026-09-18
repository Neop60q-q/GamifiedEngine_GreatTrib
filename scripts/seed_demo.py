from database.connection import SessionLocal, engine
from database.models import (
    Achievement,
    AchievementCondition,
    Base,
    CosmeticItem,
    CosmeticRewardRule,
    LevelRule,
    XPRuleSet,
    XPRuleValue,
    Skill,
    SkillLevelRule
)


XP_VALUES = {
    "DIFFICULTY": {
        "VERY_EASY": 0,
        "EASY": 10,
        "MODERATE": 25,
        "DIFFICULT": 40,
        "EXPERT": 60,
    },
    "TIME": {
        "UNDER_10_MIN": 5,
        "TEN_TO_THIRTY_MIN": 15,
        "THIRTY_TO_SIXTY_MIN": 30,
        "ONE_TO_THREE_HOURS": 60,
        "HALF_DAY": 90,
        "FULL_DAY": 120,
        "MULTIPLE_DAYS": 200,
        "MULTIPLE_WEEKS": 350,
    },
    "SKILL_LEVEL": {
        "NONE": 0,
        "BEGINNER": 10,
        "INTERMEDIATE": 20,
        "ADVANCED": 35,
        "PROFESSIONAL": 50,
    },
    "EFFORT": {
        "MINIMAL": 0,
        "LOW": 10,
        "MODERATE": 20,
        "HIGH": 35,
        "INTENSIVE": 50,
    },
    "COMPLEXITY": {
        "SINGLE_STEP": 0,
        "TWO_STEP": 10,
        "MULTIPLE_STEPS": 20,
        "MULTI_STAGE": 40,
        "ONGOING": 60,
    },
    "STUDENT_IMPACT": {
        "LOW": 0,
        "MODERATE": 10,
        "HIGH": 25,
        "SIGNIFICANT": 40,
        "TRANSFORMATIONAL": 60,
    },
    "VERIFICATION": {
        "AUTOMATIC": 0,
        "SELF_DECLARATION": 5,
        "EDUCATOR_APPROVAL": 15,
        "EMPLOYER_APPROVAL": 20,
        "MANUAL_REVIEW": 20,
    },
    "COMPLETION_TYPE": {
        "COMPLETION": 0,
        "PASS_FAIL": 5,
        "SCORE_BASED": 10,
        "ATTENDANCE": 5,
        "SUBMISSION": 10,
        "EMPLOYER_ACCEPTED": 15,
    },
}


LEVELS = [
    (1, 0, "STUDENT_PROFILE", "Student Profile"),
    (2, 100, "BASIC_JOB_APPLICATIONS", "Basic Job Applications"),
    (3, 350, "PREMIUM_CHALLENGES", "Premium Challenges"),
    (4, 750, "EMPLOYER_RECOMMENDATIONS", "Employer Recommendations"),
    (5, 1350, "ADVANCED_OPPORTUNITIES", "Advanced Opportunities"),
    (6, 2250, "VERIFIED_CONTRIBUTOR", "Verified Contributor"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        rule_set = (
            db.query(XPRuleSet)
            .filter(
                XPRuleSet.name == "Phase One Rules",
                XPRuleSet.version == 1
            )
            .first()
        )

        if rule_set is None:
            rule_set = XPRuleSet(
                name="Phase One Rules",
                version=1,
                status="Active"
            )
            db.add(rule_set)
            db.commit()
            db.refresh(rule_set)

            for factor, values in XP_VALUES.items():
                for option, xp in values.items():
                    db.add(
                        XPRuleValue(
                            rule_set_id=rule_set.id,
                            factor_code=factor,
                            option_code=option,
                            xp_value=xp
                        )
                    )

        skill_levels = [(1, 0), (2, 100), (3, 350), (4, 750), (5, 1350), (6, 2250)]
        for level, required_xp in skill_levels:
            existing_skill_level = db.query(SkillLevelRule).filter(
                SkillLevelRule.skill_id.is_(None), SkillLevelRule.level == level
            ).first()
            if existing_skill_level is None:
                db.add(SkillLevelRule(skill_id=None, level=level, required_xp=required_xp))

        demo_skills = [
            ("skill-software-development", "SOFTWARE_DEVELOPMENT", "Software Development", "Technology"),
            ("skill-cybersecurity", "CYBERSECURITY", "Cybersecurity", "Technology"),
            ("skill-communication", "COMMUNICATION", "Communication", "Professional Skills"),
        ]
        for external_id, code, name, category in demo_skills:
            if db.query(Skill).filter(Skill.code == code).first() is None:
                db.add(Skill(external_id=external_id, code=code, name=name, category=category, status="Active"))

        for level, required_xp, unlock_code, unlock_name in LEVELS:
            if db.get(LevelRule, level) is None:
                db.add(
                    LevelRule(
                        level=level,
                        required_xp=required_xp,
                        unlock_code=unlock_code,
                        unlock_name=unlock_name
                    )
                )



        for level, required_xp, unlock_code, unlock_name in LEVELS:
            if db.get(LevelRule, level) is None:
                db.add(
                    LevelRule(
                        level=level,
                        required_xp=required_xp,
                        unlock_code=unlock_code,
                        unlock_name=unlock_name
                    )
                )

        career = (
            db.query(Achievement)
            .filter(Achievement.code == "CAREER_STARTER")
            .first()
        )

        if career is None:
            career = Achievement(
                external_id="achievement-career-starter",
                code="CAREER_STARTER",
                name="Career Starter",
                description="Reach 1,000 total XP.",
                bonus_xp=50,
                status="Active"
            )
            db.add(career)
            db.commit()
            db.refresh(career)

            db.add(
                AchievementCondition(
                    achievement_id=career.id,
                    condition_type="TOTAL_XP",
                    operator="GTE",
                    target_value=1000
                )
            )

        cosmetic_specs = [
            (
                "CAREER_BLAZER",
                "Career Blazer",
                "outfit",
                "avatars/outfits/career_blazer_v1",
                "Uncommon"
            ),
            (
                "CAREER_STAR_PIN",
                "Career Star Pin",
                "badge",
                "avatars/accessories/career_star_pin_v1",
                "Rare"
            ),
            (
                "GOLD_JACKET",
                "Gold Jacket",
                "outfit",
                "avatars/outfits/gold_jacket_v1",
                "Rare"
            ),
        ]

        items = {}

        for code, name, slot, asset, rarity in cosmetic_specs:
            item = (
                db.query(CosmeticItem)
                .filter(CosmeticItem.code == code)
                .first()
            )

            if item is None:
                item = CosmeticItem(
                    code=code,
                    name=name,
                    slot=slot,
                    asset_key=asset,
                    rarity=rarity
                )
                db.add(item)
                db.commit()
                db.refresh(item)

            items[code] = item

        reward_specs = [
            (
                items["CAREER_BLAZER"].id,
                "ACTIVITY",
                "activity-employer-assessment"
            ),
            (
                items["CAREER_STAR_PIN"].id,
                "ACHIEVEMENT",
                "CAREER_STARTER"
            ),
            (
                items["GOLD_JACKET"].id,
                "LEVEL",
                "LEVEL_5"
            ),
        ]

        for item_id, source_type, source_code in reward_specs:
            existing = (
                db.query(CosmeticRewardRule)
                .filter(
                    CosmeticRewardRule.item_id == item_id,
                    CosmeticRewardRule.source_type == source_type,
                    CosmeticRewardRule.source_code == source_code
                )
                .first()
            )

            if existing is None:
                db.add(
                    CosmeticRewardRule(
                        item_id=item_id,
                        source_type=source_type,
                        source_code=source_code,
                        active=True
                    )
                )

        db.commit()
        print("Demo rule data seeded.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
