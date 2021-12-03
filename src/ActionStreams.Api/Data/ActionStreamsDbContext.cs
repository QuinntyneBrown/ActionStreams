using ActionStreams.Api.Models;
using ActionStreams.Api.Core;
using ActionStreams.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace ActionStreams.Api.Data
{
    public class ActionStreamsDbContext: DbContext, IActionStreamsDbContext
    {
        public DbSet<ToDo> ToDos { get; private set; }
        public DbSet<StoredEvent> StoredEvents { get; private set; }
        public ActionStreamsDbContext(DbContextOptions options)
            :base(options)
        {
            SavingChanges += DbContext_SavingChanges;
        }

        private void DbContext_SavingChanges(object sender, SavingChangesEventArgs e)
        {
            var entries = ChangeTracker.Entries<AggregateRoot>()
                .Where(
                    e => e.State == EntityState.Added ||
                    e.State == EntityState.Modified)
                .Select(e => e.Entity)
                .ToList();
            
            foreach (var aggregate in entries)
            {
                foreach (var storedEvent in aggregate.StoredEvents)
                {
                    StoredEvents.Add(storedEvent);
                }
            }
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ActionStreamsDbContext).Assembly);
        }
        
        public override void Dispose()
        {
            SavingChanges -= DbContext_SavingChanges;
            
            base.Dispose();
        }
        
        public override ValueTask DisposeAsync()
        {
            SavingChanges -= DbContext_SavingChanges;
            
            return base.DisposeAsync();
        }
        
    }
}
