from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Stable integration reference supplied/mapped by Alumable/Laravel.
    external_id = Column(String(255), unique=True, nullable=False, index=True)
    source_system = Column(String(50), default="ALUMABLE", nullable=False)

    creator_external_id = Column(String(255), nullable=False)
    creator_role = Column(String(30), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)

    # Advanced XP fields are optional until the XP configuration feature is
    # enabled for an activity.
    difficulty = Column(String(50), nullable=True)
    estimated_time_value = Column(Float, nullable=True)
    estimated_time_unit = Column(String(20), nullable=True)
    skill_level = Column(String(50), nullable=True)
    effort = Column(String(50), nullable=True)
    complexity = Column(String(50), nullable=True)
    student_impact = Column(String(50), nullable=True)
    verification_method = Column(String(50), nullable=True)
    repeatability = Column(String(50), nullable=True)
    completion_type = Column(String(50), nullable=True)

    final_xp = Column(Integer, nullable=False, default=0)
    xp_rule_version = Column(Integer, nullable=False, default=1)
    version = Column(Integer, nullable=False, default=1)

    status = Column(String(30), nullable=False, default="Draft")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )


class ActivityVersion(Base):
    __tablename__ = "activity_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    activity_id = Column(Integer, ForeignKey(
        "activities.id"), nullable=False, index=True)
    version = Column(Integer, nullable=False)
    final_xp = Column(Integer, nullable=False)
    xp_rule_version = Column(Integer, nullable=False)

    snapshot_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("activity_id", "version", name="uq_activity_version"),
    )


class ActivityCompletion(Base):
    __tablename__ = "activity_completions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_user_id = Column(String(255), nullable=False, index=True)
    activity_id = Column(Integer, ForeignKey(
        "activities.id"), nullable=False, index=True)
    activity_version = Column(Integer, nullable=False)
    xp_value_at_completion = Column(Integer, nullable=False)

    completion_event_id = Column(String(255), nullable=False, unique=True)
    verification_status = Column(String(30), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class XPTransaction(Base):
    __tablename__ = "xp_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)

    external_user_id = Column(String(255), nullable=False, index=True)
    amount = Column(Integer, nullable=False)

    transaction_type = Column(String(30), nullable=False)  # AWARD / ADJUSTMENT
    # ACTIVITY / ACHIEVEMENT...
    source_type = Column(String(50), nullable=False)
    source_id = Column(Integer, nullable=False)

    source_completion_id = Column(Integer, nullable=True)
    idempotency_key = Column(String(255), nullable=False, unique=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class StudentProgress(Base):
    __tablename__ = "student_progress"

    external_user_id = Column(String(255), primary_key=True)
    total_xp = Column(Integer, nullable=False, default=0)
    current_level = Column(Integer, nullable=False, default=1)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )


class XPRuleSet(Base):
    __tablename__ = "xp_rule_sets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    version = Column(Integer, nullable=False)
    status = Column(String(30), nullable=False, default="Draft")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("name", "version", name="uq_rule_set_name_version"),
    )


class XPRuleValue(Base):
    __tablename__ = "xp_rule_values"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rule_set_id = Column(Integer, ForeignKey(
        "xp_rule_sets.id"), nullable=False, index=True)
    factor_code = Column(String(50), nullable=False)
    option_code = Column(String(50), nullable=False)
    xp_value = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "rule_set_id",
            "factor_code",
            "option_code",
            name="uq_rule_value"
        ),
    )


class LevelRule(Base):
    __tablename__ = "level_rules"

    level = Column(Integer, primary_key=True)
    required_xp = Column(Integer, nullable=False)
    unlock_code = Column(String(100), nullable=True)
    unlock_name = Column(String(255), nullable=True)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(String(255), nullable=False, unique=True)
    code = Column(String(100), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    bonus_xp = Column(Integer, nullable=False, default=0)
    status = Column(String(30), nullable=False, default="Active")
    version = Column(Integer, nullable=False, default=1)


class AchievementCondition(Base):
    __tablename__ = "achievement_conditions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    achievement_id = Column(Integer, ForeignKey(
        "achievements.id"), nullable=False, index=True)

    # POC supports TOTAL_XP. More condition types can be added without changing
    # the achievement table structure.
    condition_type = Column(String(50), nullable=False)
    operator = Column(String(20), nullable=False)
    target_value = Column(Integer, nullable=False)


class StudentAchievement(Base):
    __tablename__ = "student_achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_user_id = Column(String(255), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey(
        "achievements.id"), nullable=False)
    achievement_version = Column(Integer, nullable=False)
    bonus_xp_at_award = Column(Integer, nullable=False, default=0)
    awarded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "external_user_id",
            "achievement_id",
            name="uq_student_achievement"
        ),
    )


class CosmeticItem(Base):
    __tablename__ = "cosmetic_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(100), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    slot = Column(String(50), nullable=False)
    asset_key = Column(String(255), nullable=False)
    rarity = Column(String(40), nullable=False, default="Common")
    status = Column(String(30), nullable=False, default="Active")


class CosmeticRewardRule(Base):
    __tablename__ = "cosmetic_reward_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("cosmetic_items.id"), nullable=False)
    source_type = Column(String(50), nullable=False)
    source_code = Column(String(100), nullable=False)
    active = Column(Boolean, nullable=False, default=True)


class StudentInventory(Base):
    __tablename__ = "student_inventory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_user_id = Column(String(255), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("cosmetic_items.id"), nullable=False)
    reward_event_id = Column(String(255), nullable=False, unique=True)
    granted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "external_user_id",
            "item_id",
            name="uq_student_cosmetic"
        ),
    )


class StudentAvatarEquipment(Base):
    __tablename__ = "student_avatar_equipment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_user_id = Column(String(255), nullable=False, index=True)
    slot = Column(String(50), nullable=False)
    item_id = Column(Integer, ForeignKey("cosmetic_items.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "external_user_id",
            "slot",
            name="uq_avatar_slot"
        ),
    )
