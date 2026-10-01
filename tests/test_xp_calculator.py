import os
import tempfile

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.models import Base, XPRuleSet, XPRuleValue
from services.xp_calculator import XPCalculator
from shared.models import XPFactors


def test_xp_calculator_reads_database_rules():
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)

    db = Session()

    rule_set = XPRuleSet(name="Test", version=1, status="Active")
    db.add(rule_set)
    db.commit()
    db.refresh(rule_set)

    # Only DIFFICULTY is set; missing factors intentionally evaluate as zero.
    db.add(
        XPRuleValue(
            rule_set_id=rule_set.id,
            factor_code="DIFFICULTY",
            option_code="MODERATE",
            xp_value=25,
        )
    )
    db.commit()

    factors = XPFactors(
        difficulty="MODERATE",
        estimated_time_value=2,
        estimated_time_unit="HOURS",
        skill_level="BEGINNER",
        effort="MODERATE",
        complexity="MULTIPLE_STEPS",
        student_impact="HIGH",
        verification_method="EDUCATOR_APPROVAL",
        repeatability="ONE_TIME",
        completion_type="ATTENDANCE",
    )

    xp, version = XPCalculator().calculate(db, factors)

    assert xp == 35
    assert version == 1
