class Account:
    def __init__(self, id, name, type, category, parent_account_id, max_value):
        self.id = id
        self.name = name
        self.type = type
        self.category = category
        self.parent_account_id = parent_account_id
        self.max_value = max_value

    def __str__(self):
        return "{}-{} [type:{}, category:{}, parent_account:{}, max_value:{}]".format(
            self.id,
            self.name,
            self.type,
            self.category,
            self.parent_account_id,
            self.max_value,
        )

    def from_dynamodb(dynamo_entry):
        return Account(
            id=dynamo_entry["AccountId"]["S"],
            name=dynamo_entry["Name"]["S"],
            type=dynamo_entry["Type"]["S"],
            category=dynamo_entry["Category"]["S"],
            parent_account_id=dynamo_entry.get("ParentAccountId", {}).get("S"),
            max_value=dynamo_entry.get("MaxValue", {}).get("S"),
        )
