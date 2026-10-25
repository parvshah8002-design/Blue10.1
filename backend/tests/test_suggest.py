import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestSuggestEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_suggest_schemes_farmer(self):
        resp = self.client.post("/api/v1/schemes/suggest", json={
            "query": "Small farmer needing yearly income support",
            "user_profile": {
                "age": 35,
                "annual_income_inr": 80000.0,
                "gender": "male",
                "state": "MH",
                "category": "obc",
                "marital_status": "married",
                "is_farmer": True,
                "is_bpl": True,
                "is_student": False,
                "is_pwd": False
            }
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["query"], "Small farmer needing yearly income support")
        self.assertTrue(len(data["understood_needs"]) > 0)
        self.assertTrue(len(data["recommendations"]) > 0)
        top = data["recommendations"][0]
        self.assertGreaterEqual(top["relevance_score"], 0.6)
        self.assertTrue(len(top["why_recommended"]) > 5)
        self.assertIsNotNone(top["eligibility_result"])

    def test_suggest_schemes_health(self):
        resp = self.client.post("/api/v1/schemes/suggest", json={
            "query": "5 Lakh free hospital treatment for my family"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(any("Health" in n for n in data["understood_needs"]))
        self.assertTrue(len(data["recommendations"]) > 0)

if __name__ == "__main__":
    unittest.main()
