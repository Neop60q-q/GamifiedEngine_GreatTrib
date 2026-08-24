from repositories.rule_repository import RuleRepository


class XPCalculator:
    """
    Configurable XP calculator.

    The factor values live in MySQL instead of Python constants.
    This means Alumable can change the matrix without redeploying the service.
    """

    def __init__(self):
        self.rules = RuleRepository()

    def _time_code(self, value: float, unit: str) -> str:
        # POC normalisation into approximate minutes.
        multiplier = {
            "MINUTES": 1,
            "HOURS": 60,
            "DAYS": 8 * 60,
            "WEEKS": 5 * 8 * 60,
            "MONTHS": 20 * 8 * 60,
        }

        minutes = value * multiplier[unit]

        if minutes < 10:
            return "UNDER_10_MIN"
        if minutes <= 30:
            return "TEN_TO_THIRTY_MIN"
        if minutes <= 60:
            return "THIRTY_TO_SIXTY_MIN"
        if minutes <= 180:
            return "ONE_TO_THREE_HOURS"
        if minutes <= 4 * 60:
            return "HALF_DAY"
        if minutes <= 8 * 60:
            return "FULL_DAY"
        if minutes <= 5 * 8 * 60:
            return "MULTIPLE_DAYS"
        return "MULTIPLE_WEEKS"

    def calculate(self, db, factors) -> tuple[int, int]:
        rule_set = self.rules.get_active_set(db)

        if rule_set is None:
            raise RuntimeError("No active XP rule set has been configured")

        xp = 10  # base XP retained as a simple POC constant

        lookups = [
            ("DIFFICULTY", factors.difficulty),
            ("TIME", self._time_code(
                factors.estimated_time_value,
                factors.estimated_time_unit
            )),
            ("SKILL_LEVEL", factors.skill_level),
            ("EFFORT", factors.effort),
            ("COMPLEXITY", factors.complexity),
            ("STUDENT_IMPACT", factors.student_impact),
            ("VERIFICATION", factors.verification_method),
            ("COMPLETION_TYPE", factors.completion_type),
        ]

        for factor_code, option_code in lookups:
            xp += self.rules.get_value(
                db,
                rule_set.id,
                factor_code,
                option_code
            )

        # Highly repeatable tasks are deliberately reduced to reduce XP farming.
        if factors.repeatability != "ONE_TIME":
            xp = round(xp * 0.75)

        xp = max(5, min(xp, 1000))

        # Round to nearest 5 for a cleaner user-facing value.
        xp = int(5 * round(xp / 5))

        return xp, rule_set.version
