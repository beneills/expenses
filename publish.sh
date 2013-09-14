[ -z "$EXPENSES_ROOT" ] && EXPENSES_ROOT=~/projects/expenses

scp -r $EXPENSES_ROOT/* linode:/srv/expenses
echo "Done."
