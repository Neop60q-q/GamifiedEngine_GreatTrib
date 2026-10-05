import json

from sqlalchemy import inspect, text
from database.connection import SessionLocal, engine
from database.models import (
    Achievement,
    Activity,
    ActivityVersion,
    ActivitySkillAllocation,
    AchievementCondition,
    Base,
    CosmeticItem,
    CosmeticRewardRule,
    LevelRule,
    XPRuleSet,
    XPRuleValue,
    Skill,
    StudentInventory,
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

    # create_all does not alter an existing MySQL table. Keep older prototype
    # databases compatible by adding the new activity gate when it is missing.
    activity_columns = {c["name"] for c in inspect(engine).get_columns("activities")}
    if "minimum_level" not in activity_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE activities "
                    "ADD COLUMN minimum_level INT NOT NULL DEFAULT 1"
                )
            )

    db = SessionLocal()

    try:
        rule_set = (
            db.query(XPRuleSet)
            .filter(XPRuleSet.name == "Phase One Rules", XPRuleSet.version == 1)
            .first()
        )

        if rule_set is None:
            rule_set = XPRuleSet(name="Phase One Rules", version=1, status="Active")
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
                            xp_value=xp,
                        )
                    )

        for level, required_xp, unlock_code, unlock_name in LEVELS:
            if db.get(LevelRule, level) is None:
                db.add(
                    LevelRule(
                        level=level,
                        required_xp=required_xp,
                        unlock_code=unlock_code,
                        unlock_name=unlock_name,
                    )
                )

        career = (
            db.query(Achievement).filter(Achievement.code == "CAREER_STARTER").first()
        )

        if career is None:
            career = Achievement(
                external_id="achievement-career-starter",
                code="CAREER_STARTER",
                name="Career Starter",
                description="Reach 1,000 total XP.",
                bonus_xp=50,
                status="Active",
            )
            db.add(career)
            db.commit()
            db.refresh(career)

            db.add(
                AchievementCondition(
                    achievement_id=career.id,
                    condition_type="TOTAL_XP",
                    operator="GTE",
                    target_value=1000,
                )
            )

        for code, name in [
            ("SOFTWARE_DEVELOPMENT", "Software Development"),
            ("CYBERSECURITY", "Cybersecurity"),
            ("COMMUNICATION", "Communication"),
            ("CAREER_READINESS", "Career Readiness"),
        ]:
            if db.query(Skill).filter(Skill.code == code).first() is None:
                db.add(Skill(code=code, name=name, status="Active"))
        db.commit()

        # Predefined activities make the prototype immediately demonstrable.
        # Their XP values deliberately line up with the configured level thresholds
        # so a fresh demo student can unlock the next gated activity in sequence.
        demo_activities = [
            {
                "external_id": "demo-daily-login",
                "title": "Daily Login",
                "description": "Return to Alumable and check your student dashboard.",
                "category": "Profile",
                "minimum_level": 1,
                "repeatability": "DAILY",
                "final_xp": 5,
                "difficulty": "VERY_EASY",
                "skills": {"CAREER_READINESS": 100},
            },
            {
                "external_id": "demo-upload-resume",
                "title": "Upload Your Resume",
                "description": "Upload a current resume to build your Alumable profile.",
                "category": "Profile",
                "minimum_level": 1,
                "repeatability": "ONE_TIME",
                "final_xp": 100,
                "difficulty": "EASY",
                "skills": {"CAREER_READINESS": 80, "COMMUNICATION": 20},
            },
            {
                "external_id": "demo-career-workshop",
                "title": "Attend Career Workshop",
                "description": "Attend a career workshop and submit your workshop notes.",
                "category": "Learning",
                "minimum_level": 2,
                "repeatability": "ONE_TIME",
                "final_xp": 250,
                "difficulty": "MODERATE",
                "skills": {"CAREER_READINESS": 60, "COMMUNICATION": 40},
            },
            {
                "external_id": "demo-development-challenge",
                "title": "Software Development Challenge",
                "description": "Complete a practical development task and submit your solution.",
                "category": "Learning",
                "minimum_level": 3,
                "repeatability": "ONE_TIME",
                "final_xp": 400,
                "difficulty": "DIFFICULT",
                "skills": {"SOFTWARE_DEVELOPMENT": 80, "COMMUNICATION": 20},
            },
            {
                "external_id": "activity-employer-assessment",
                "title": "Complete Employer Assessment",
                "description": "Complete a cybersecurity scenario reviewed by an employer.",
                "category": "Employment",
                "minimum_level": 4,
                "repeatability": "ONE_TIME",
                "final_xp": 600,
                "difficulty": "DIFFICULT",
                "skills": {"CYBERSECURITY": 80, "COMMUNICATION": 20},
            },
            {
                "external_id": "demo-industry-project",
                "title": "Industry Project Challenge",
                "description": "Complete an advanced industry project and present your outcome.",
                "category": "Employment",
                "minimum_level": 5,
                "repeatability": "ONE_TIME",
                "final_xp": 900,
                "difficulty": "EXPERT",
                "skills": {"SOFTWARE_DEVELOPMENT": 50, "CYBERSECURITY": 30, "COMMUNICATION": 20},
            },
        ]

        for spec in demo_activities:
            activity = (
                db.query(Activity)
                .filter(Activity.external_id == spec["external_id"])
                .first()
            )
            if activity is None:
                activity = Activity(
                    external_id=spec["external_id"],
                    source_system="ALUMABLE",
                    creator_external_id="demo-alumable",
                    creator_role="EDUCATOR",
                    title=spec["title"],
                    description=spec["description"],
                    category=spec["category"],
                    difficulty=spec["difficulty"],
                    estimated_time_value=30,
                    estimated_time_unit="MINUTES",
                    skill_level="BEGINNER",
                    effort="MODERATE",
                    complexity="SINGLE_STEP",
                    student_impact="MODERATE",
                    verification_method="SELF_DECLARATION",
                    repeatability=spec["repeatability"],
                    completion_type="COMPLETION",
                    minimum_level=spec["minimum_level"],
                    final_xp=spec["final_xp"],
                    xp_rule_version=1,
                    version=1,
                    status="Active",
                )
                db.add(activity)
                db.flush()
                db.add(
                    ActivityVersion(
                        activity_id=activity.id,
                        version=1,
                        final_xp=activity.final_xp,
                        xp_rule_version=1,
                        snapshot_json=json.dumps({
                            "seeded_demo": True,
                            "minimum_level": activity.minimum_level,
                            "repeatability": activity.repeatability,
                        }),
                    )
                )

                for skill_code, percentage in spec["skills"].items():
                    skill = db.query(Skill).filter(Skill.code == skill_code).first()
                    if skill:
                        db.add(
                            ActivitySkillAllocation(
                                activity_id=activity.id,
                                skill_id=skill.id,
                                percentage=percentage,
                            )
                        )
        db.commit()

        cosmetic_specs = [
            (
                "STARTER_TEE",
                "Alumable Starter Tee",
                "outfit",
                "avatars/outfits/starter_tee_v1",
                "Common",
            ),
            (
                "STARTER_PURPLE_HOODIE",
                "Purple Campus Hoodie",
                "outfit",
                "avatars/outfits/starter_purple_hoodie_v1",
                "Common",
            ),
            (
                "SECURITY_HOODIE",
                "Security Hoodie",
                "outfit",
                "avatars/outfits/security_hoodie_v1",
                "Uncommon",
            ),
            (
                "CAREER_BLAZER",
                "Career Blazer",
                "outfit",
                "avatars/outfits/career_blazer_v1",
                "Uncommon",
            ),
            (
                "CAREER_STAR_PIN",
                "Career Star Pin",
                "badge",
                "avatars/accessories/career_star_pin_v1",
                "Rare",
            ),
            (
                "GOLD_JACKET",
                "Gold Jacket",
                "outfit",
                "avatars/outfits/gold_jacket_v1",
                "Rare",
            ),
            (
                "ALUMABLE_VARSITY_JACKET",
                "Alumable Varsity Jacket",
                "outfit",
                "avatars/outfits/alumable_varsity_jacket_v1",
                "Rare",
            ),
        ]

        items = {}

        for code, name, slot, asset, rarity in cosmetic_specs:
            item = db.query(CosmeticItem).filter(CosmeticItem.code == code).first()

            if item is None:
                item = CosmeticItem(
                    code=code, name=name, slot=slot, asset_key=asset, rarity=rarity
                )
                db.add(item)
                db.commit()
                db.refresh(item)

            items[code] = item

        # Give the demo student only the two basic cosmetics. The showcase
        # cosmetics remain locked until they are earned through created tasks.
        for starter_code in ("STARTER_TEE", "STARTER_PURPLE_HOODIE"):
            starter = items[starter_code]
            owned = (
                db.query(StudentInventory)
                .filter(
                    StudentInventory.external_user_id == "demo-student-1",
                    StudentInventory.item_id == starter.id,
                )
                .first()
            )
            if owned is None:
                db.add(
                    StudentInventory(
                        external_user_id="demo-student-1",
                        item_id=starter.id,
                        reward_event_id=f"demo-starter-{starter_code.lower()}",
                    )
                )
        db.commit()

        # Keep the three showcase outfits free from predefined reward rules.
        # This lets the Portal-created task be the action that unlocks them.
        predefined_showcase_rules = [
            (items["CAREER_BLAZER"].id, "ACTIVITY", "activity-employer-assessment"),
            (items["GOLD_JACKET"].id, "LEVEL", "LEVEL_5"),
        ]
        for item_id, source_type, source_code in predefined_showcase_rules:
            db.query(CosmeticRewardRule).filter(
                CosmeticRewardRule.item_id == item_id,
                CosmeticRewardRule.source_type == source_type,
                CosmeticRewardRule.source_code == source_code,
            ).delete(synchronize_session=False)
        db.commit()

        reward_specs = [
            (items["CAREER_STAR_PIN"].id, "ACHIEVEMENT", "CAREER_STARTER"),
        ]

        for item_id, source_type, source_code in reward_specs:
            existing = (
                db.query(CosmeticRewardRule)
                .filter(
                    CosmeticRewardRule.item_id == item_id,
                    CosmeticRewardRule.source_type == source_type,
                    CosmeticRewardRule.source_code == source_code,
                )
                .first()
            )

            if existing is None:
                db.add(
                    CosmeticRewardRule(
                        item_id=item_id,
                        source_type=source_type,
                        source_code=source_code,
                        active=True,
                    )
                )

        db.commit()
        print("Demo rule data seeded.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
