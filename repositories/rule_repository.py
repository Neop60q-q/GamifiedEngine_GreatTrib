from database.models import XPRuleSet, XPRuleValue


class RuleRepository:
    def get_active_set(self, db):
        return (
            db.query(XPRuleSet)
            .filter(XPRuleSet.status == "Active")
            .order_by(XPRuleSet.version.desc())
            .first()
        )

    def get_value(
        self,
        db,
        rule_set_id: int,
        factor_code: str,
        option_code: str
    ) -> int:
        row = (
            db.query(XPRuleValue)
            .filter(
                XPRuleValue.rule_set_id == rule_set_id,
                XPRuleValue.factor_code == factor_code,
                XPRuleValue.option_code == option_code
            )
            .first()
        )

        if row is None:
            return 0

        return row.xp_value
