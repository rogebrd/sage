class Subtotal:
    def __init__(
        self, id, subtotal_type, subtotal_type_id, subtotal_value, update_time
    ):
        self.id = id
        self.subtotal_type = subtotal_type
        self.subtotal_type_id = subtotal_type_id
        self.subtotal_value = subtotal_value
        self.update_time = update_time

    def __str__(self):
        return "{}[{} id: {}, value:{}, update time:{}]".format(
            self.id,
            self.subtotal_type,
            self.subtotal_type_id,
            self.subtotal_value,
            self.update_time,
        )

    def from_dynamodb(dynamo_entry):
        return Subtotal(
            id=dynamo_entry["SubtotalId"]["S"],
            subtotal_type=dynamo_entry["SubtotalType"]["S"],
            subtotal_type_id=dynamo_entry["SubtotalTypeId"]["S"],
            subtotal_value=float(dynamo_entry["Subtotal"]["N"]),
            update_time=float(dynamo_entry["UpdateTime"]["N"]),
        )
