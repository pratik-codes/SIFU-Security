import unittest
from lambda_function import lambda_handler

class TestLambdaFunction(unittest.TestCase):

	def test_lambda_handler(self):
		event = {'contract_addresses': ['Contract1', 'Contract2']}
		response = lambda_handler(event, None)
		self.assertEqual(response['statusCode'], 200)
		self.assertIn('Transactions processed and analyzed successfully', response['body'])

if __name__ == '__main__':
	unittest.main()
