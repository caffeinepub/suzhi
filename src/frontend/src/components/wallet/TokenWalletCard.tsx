import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetBalance, useTransfer } from '../../hooks/useQueries';
import { Wallet, Send, Coins, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Principal } from '@dfinity/principal';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TokenWalletCard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: balance, isLoading: balanceLoading } = useGetBalance(principal);
  const transferMutation = useTransfer();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    setValidationError(null);

    // Validate recipient principal
    if (!recipient.trim()) {
      setValidationError('Please enter a recipient principal ID');
      return false;
    }

    try {
      Principal.fromText(recipient.trim());
    } catch (error) {
      setValidationError('Invalid principal ID format. Please check the recipient address.');
      return false;
    }

    // Validate amount
    if (!amount.trim()) {
      setValidationError('Please enter an amount');
      return false;
    }

    let transferAmount: bigint;
    try {
      transferAmount = BigInt(amount);
    } catch (error) {
      setValidationError('Invalid amount. Please enter a valid number.');
      return false;
    }

    if (transferAmount <= BigInt(0)) {
      setValidationError('Amount must be greater than zero');
      return false;
    }

    // Check if user has sufficient balance
    if (balance !== undefined && transferAmount > balance) {
      setValidationError(`Insufficient balance. You have ${balance.toString()} SUZHI tokens available.`);
      return false;
    }

    return true;
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const recipientPrincipal = Principal.fromText(recipient.trim());
      const transferAmount = BigInt(amount);

      transferMutation.mutate(
        { to: recipientPrincipal, amount: transferAmount },
        {
          onSuccess: () => {
            setRecipient('');
            setAmount('');
            setValidationError(null);
          }
        }
      );
    } catch (error: any) {
      setValidationError('Transfer failed: ' + (error.message || 'Unknown error'));
    }
  };

  const formattedBalance = balance !== undefined ? balance.toString() : '0';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gold" />
            SUZHI Balance
          </CardTitle>
          <CardDescription>Your token holdings</CardDescription>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gold/10 to-earth/10 p-6 rounded-lg border border-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-4xl font-bold text-gold mt-1">{formattedBalance}</p>
                    <p className="text-xs text-muted-foreground mt-1">SUZHI Tokens</p>
                  </div>
                  <Coins className="w-12 h-12 text-gold/30" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Earn tokens through verified contributions</p>
                <p>• Use tokens for governance voting</p>
                <p>• Transfer tokens to other citizens</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-gold" />
            Transfer Tokens
          </CardTitle>
          <CardDescription>Send SUZHI to another citizen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-4">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Principal</Label>
              <Input
                id="recipient"
                placeholder="Enter principal ID"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setValidationError(null);
                }}
                required
                disabled={transferMutation.isPending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(value);
                  setValidationError(null);
                }}
                required
                disabled={transferMutation.isPending}
              />
              {balance !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Available: {balance.toString()} SUZHI
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full gold-gradient text-brown font-semibold"
              disabled={transferMutation.isPending || !recipient || !amount}
            >
              {transferMutation.isPending ? 'Transferring...' : 'Send Tokens'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
