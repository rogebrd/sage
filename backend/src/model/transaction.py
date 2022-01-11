from typing import List
from model.entry import Entry


class Transaction:

    def __init__(self, id, entry_ids, date):
        self.id = id
        self.entry_ids = entry_ids
        self.date = date
    
    def __str__(self):
        return "{} [entry_ids:{}, date:{}]".format(self.id, self.entry_ids, self.date)

    def filter_entries(self, all_entries: List[Entry]) -> List[Entry]:
        return [entry for entry in all_entries if entry.id in self.entry_ids]

    def to_json(self, all_entries: List[Entry]) -> dict:
        filtered_entries = self.filter_entries(all_entries)
        return {
            "id": self.id,
            "date": self.date,
            "entries": [entry.to_json() for entry in filtered_entries]
        }

    def from_dynamodb(dynamo_entry):
        return Transaction(
            id=dynamo_entry['TransactionId']['S'],
            entry_ids=dynamo_entry['EntryIds']['SS'],
            date=dynamo_entry['Date']['N']
        )
    