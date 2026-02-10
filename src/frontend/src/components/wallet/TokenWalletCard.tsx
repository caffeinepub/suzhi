import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetBalance, useTransfer } from '../../hooks/useQueries';
import { Wallet, Send, Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Principal } from '@dfinity/principal';

export default function TokenWalletCard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: balance, isLoading: balanceLoading } = useGetBalance(principal);
  const transferMutation = useTransfer();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recipientPrincipal = Principal.fromText(recipient);
      const transferAmount = BigInt(amount);
      transferMutation.mutate(
        { to: recipientPrincipal, amount: transferAmount },
        {
          onSuccess: () => {
            setRecipient('');
            setAmount('');
          }
        }
      );
    } catch (error) {
      console.error('Invalid principal or amount:', error);
    }
  };

  const formattedBalance = balance ? balance.toString() : '0';

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
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Principal</Label>
              <Input
                id="recipient"
                placeholder="Enter principal ID"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
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
