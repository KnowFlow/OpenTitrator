from ...models.experiment import Experiment


def generate_csv(experiment: Experiment) -> str:
    lines = ["Volume(mL),Reading,Timestamp"]
    for step in experiment.steps:
        lines.append(f"{step.volume_ml},{step.reading},{step.timestamp}")
    return "\n".join(lines)
