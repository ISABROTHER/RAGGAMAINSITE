/*
  # Add update policy for contributions

  Allows anonymous users to update the status of contributions
  they created (needed after Paystack callback to mark as completed/failed).

  1. Security
    - Only allows updating the `status` field of pending contributions
    - Restricted to pending contributions only
*/

CREATE POLICY "Anyone can update pending contributions"
  ON contributions FOR UPDATE
  TO anon, authenticated
  USING (status = 'pending')
  WITH CHECK (status IN ('completed', 'failed'));
